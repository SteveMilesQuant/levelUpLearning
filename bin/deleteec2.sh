# Remove as github runner
REG_TOKEN=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_PAT" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/actions/runners/registration-token \
  | jq -r .token)

ssh -o StrictHostKeyChecking=no -i ~/.ssh/lul.pem ec2-user@$IP_ADDRESS "REG_TOKEN=$REG_TOKEN bash -s" <<'EOF'
./actions-runner/config.sh remove --token $REG_TOKEN
EOF


# Terminate in AWS
aws ec2 terminate-instances --instance-ids "$INSTANCE_ID" --region us-east-2 --query 'TerminatingInstances[0].InstanceId' --output text

jq --arg id "" '.awsEc2OldInstanceId = $id' .vscode/settings.json > .vscode/settings.tmp && mv .vscode/settings.tmp .vscode/settings.json
jq --arg id "" '.awsEc2OldInstanceIPAddress = $id' .vscode/settings.json > .vscode/settings.tmp && mv .vscode/settings.tmp .vscode/settings.json

echo "Terminated instance $INSTANCE_ID"