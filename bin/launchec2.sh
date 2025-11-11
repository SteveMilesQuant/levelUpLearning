REGION=us-east-2
AMI_ID=$(aws ssm get-parameters --names "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2" --region $REGION --query "Parameters[0].Value" --output text)
echo "AMI_ID=$AMI_ID"
INSTANCE_ID=$(aws ec2 run-instances --image-id "$AMI_ID" --count 1 --instance-type t3.micro --key-name lul --security-group-ids "$SEC_GROUP_ID" --region $REGION --query "Instances[0].InstanceId" --output text)
echo "INSTANCE_ID=$INSTANCE_ID"
IP_ADDRESS=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[*].Instances[*].PublicIpAddress" --output text)
echo "IP_ADDRESS=$IP_ADDRESS"

REG_TOKEN=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_PAT" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/actions/runners/registration-token \
  | jq -r .token)

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

scp -o StrictHostKeyChecking=no -i ~/.ssh/lul.pem -r ./api/.env ec2-user@$IP_ADDRESS:/home/ec2-user/lul.env
scp -o StrictHostKeyChecking=no -i ~/.ssh/lul.pem -r ./scripts ec2-user@$IP_ADDRESS:/home/ec2-user/lul-scripts
ssh -o StrictHostKeyChecking=no -i ~/.ssh/lul.pem ec2-user@$IP_ADDRESS "REG_TOKEN=$REG_TOKEN bash -s" <<'EOF'
# Create runner directory
mkdir -p actions-runner && cd actions-runner

# Download and extract latest runner
RUNNER_VERSION=2.329.0
curl -o actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz -L https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz
tar xzf ./actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

# Configure runner with tags
./config.sh --url https://github.com/SteveMilesQuant/levelUpLearning --token $REG_TOKEN --labels new-runner,self-hosted --unattended

# Install as service and start
sudo cp /home/ec2-user/lul-scripts/github-runner.service /etc/systemd/system/github-runner.service
sudo systemctl daemon-reload
sudo systemctl enable github-runner.service
sudo systemctl start github-runner.service
EOF

jq --arg id "$INSTANCE_ID" '.awsEc2InstanceId = $id' .vscode/settings.json > .vscode/settings.tmp && mv .vscode/settings.tmp .vscode/settings.json
jq --arg id "$IP_ADDRESS" '.awsEc2InstanceIPAddress = $id' .vscode/settings.json > .vscode/settings.tmp && mv .vscode/settings.tmp .vscode/settings.json


