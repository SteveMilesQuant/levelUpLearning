AMI_ID=$(aws ssm get-parameters --names "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2" --region us-east-2 --query "Parameters[0].Value" --output text)
INSTANCE_ID=$(aws ec2 run-instances --image-id "$AMI_ID" --count 1 --instance-type t2.micro --key-name lul --security-group-ids "$SEC_GROUP_ID" --region us-east-2 --query "Instances[0].InstanceId" --output text)
IP_ADDRESS=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[*].Instances[*].PublicIpAddress" --output text)
REG_TOKEN=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_PAT" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/actions/runners/registration-token \
  | jq -r .token)

ssh -i ~/.ssh/lul.pem ec2-user@$IP_ADDRESS "REG_TOKEN=$REG_TOKEN bash -s" <<'EOF'
# Create runner directory
mkdir -p actions-runner && cd actions-runner

# Download and extract latest runner
curl -o actions-runner-linux-x64-2.328.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.328.0/actions-runner-linux-x64-2.328.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.328.0.tar.gz

# Configure runner with tags
./config.sh --url https://github.com/SteveMilesQuant/levelUpLearning --token $REG_TOKEN --name my-ec2-runner --labels new-runner,self-hosted --unattended

# Install as service and start
sudo ./svc.sh install
sudo ./svc.sh start
EOF


echo "Launched instance ID: $INSTANCE_ID\nIP: $IP_ADDRESS"