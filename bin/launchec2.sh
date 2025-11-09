AMI_ID=$(aws ssm get-parameters --names "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2" --region us-east-2 --query "Parameters[0].Value" --output text)
INSTANCE_ID=$(aws ec2 run-instances --image-id "$AMI_ID" --count 1 --instance-type t2.micro --key-name lul --security-group-ids "$SEC_GROUP_ID" --region us-east-2 --query "Instances[0].InstanceId" --output text)
IP_ADDRESS=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[*].Instances[*].PublicIpAddress" --output text)
REG_TOKEN=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_PAT" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/actions/runners/registration-token \
  | jq -r .token)

scp -o StrictHostKeyChecking=no -i ~/.ssh/lul.pem -r ./scripts ec2-user@$IP_ADDRESS:/home/ec2-user/lul-scripts
ssh -o StrictHostKeyChecking=no -i ~/.ssh/lul.pem ec2-user@$IP_ADDRESS "REG_TOKEN=$REG_TOKEN bash -s" <<'EOF'
# Create runner directory
mkdir -p actions-runner && cd actions-runner

# Download and extract latest runner
curl -o actions-runner-linux-x64-2.328.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.328.0/actions-runner-linux-x64-2.328.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.328.0.tar.gz

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

echo "Launched instance ID: $INSTANCE_ID"
echo "IP: $IP_ADDRESS"

