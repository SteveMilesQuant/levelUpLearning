# Expects the following environment variables (set via .vscode/settings.json and the "Launch EC2" task):
#   SEC_GROUP_ID   - AWS security group ID to assign to the instance
#   GITHUB_OWNER   - GitHub username or org that owns the repo
#   GITHUB_REPO    - GitHub repository name
#   GITHUB_PAT     - GitHub classic PAT with repo scope (used to get a runner registration token)

REGION=us-east-2
# Ubuntu AMI for us-east-2; update as needed: https://cloud-images.ubuntu.com/locator/ec2/
AMI_ID=ami-0f5fcdfbd140e4ab7

# Launch a new t3.micro instance with a 30 GB gp3 root volume using the "lul" key pair.
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id "$AMI_ID" \
  --count 1 \
  --instance-type t3.micro \
  --key-name lul \
  --security-group-ids "$SEC_GROUP_ID" \
  --region $REGION \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":30,"VolumeType":"gp3","DeleteOnTermination":true}}]' \
  --query "Instances[0].InstanceId" \
  --output text)
echo "INSTANCE_ID=$INSTANCE_ID"
# Write the instance ID back to .vscode/settings.json so the "Delete EC2" task can reference it.
jq --arg id "$INSTANCE_ID" '.awsEc2InstanceId = $id' .vscode/settings.json > .vscode/settings.tmp && mv .vscode/settings.tmp .vscode/settings.json

# Retrieve the public IP assigned to the new instance.
IP_ADDRESS=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[*].Instances[*].PublicIpAddress" --output text)
echo "IP_ADDRESS=$IP_ADDRESS"
# Write the IP back to .vscode/settings.json for reference (e.g. updating Route 53).
jq --arg id "$IP_ADDRESS" '.awsEc2InstanceIPAddress = $id' .vscode/settings.json > .vscode/settings.tmp && mv .vscode/settings.tmp .vscode/settings.json

# Obtain a one-time GitHub Actions runner registration token via the GitHub API.
REG_TOKEN=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_PAT" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/actions/runners/registration-token \
  | jq -r .token)
echo REG_TOKEN=$REG_TOKEN

# Wait until both EC2 health checks pass before attempting to SSH in.
while true; do
  SYS_STATUS=$(aws ec2 describe-instance-status \
    --instance-ids "$INSTANCE_ID" \
    --region "$REGION" \
    --query "InstanceStatuses[0].SystemStatus.Status" \
    --output text)
  INST_STATUS=$(aws ec2 describe-instance-status \
    --instance-ids "$INSTANCE_ID" \
    --region "$REGION" \
    --query "InstanceStatuses[0].InstanceStatus.Status" \
    --output text)
  
  if [ "$SYS_STATUS" == "ok" ] && [ "$INST_STATUS" == "ok" ]; then
    echo "Instance is ready!"
    break
  else
    echo "System status: $SYS_STATUS, Instance status: $INST_STATUS. Checking again in 10s..."
    sleep 10
  fi
done

# Copy the production environment file to the instance (used by the API container at runtime).
scp -o StrictHostKeyChecking=no -i ~/.ssh/lul.pem -r ./api/.env.prod ubuntu@$IP_ADDRESS:/home/ubuntu/lul.env
# Copy the scripts directory (nginx configs, certcheck script, systemd service file) to the instance.
ssh -i ~/.ssh/lul.pem ubuntu@$IP_ADDRESS "rm -rf /home/ubuntu/lul-scripts"
scp -o StrictHostKeyChecking=no -i ~/.ssh/lul.pem -r ./scripts ubuntu@$IP_ADDRESS:/home/ubuntu/lul-scripts

# On the remote instance: download, configure, and start the GitHub Actions self-hosted runner.
# The runner is registered with the label "new-runner"; relabel it to "active-deployment" in
# GitHub (Settings → Actions → Runners) after the "New Server Setup" workflow completes.
ssh -o StrictHostKeyChecking=no -i ~/.ssh/lul.pem ubuntu@$IP_ADDRESS "REG_TOKEN=$REG_TOKEN bash -s" <<'EOF'
# Create runner directory
mkdir -p actions-runner && cd actions-runner

# Download and extract latest runner
RUNNER_VERSION=2.329.0
curl -o actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz -L https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz
tar xzf ./actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

# Configure runner with tags
./config.sh --url https://github.com/SteveMilesQuant/levelUpLearning --token $REG_TOKEN --labels new-runner,self-hosted --unattended

# Install as a systemd service so the runner survives reboots, then start it
sudo cp /home/ubuntu/lul-scripts/github-runner.service /etc/systemd/system/github-runner.service
sudo systemctl daemon-reload
sudo systemctl enable github-runner.service
sudo systemctl start github-runner.service
EOF





