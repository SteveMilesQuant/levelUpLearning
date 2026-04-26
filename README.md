# Level Up Learning

FastAPI web application with MySQL database for managing the "Level Up Learning" small business for track out educational camps. Deployment notes below assume you have no prior experience with docker, aws, and linux, and as such may require updating over time.

## Common set up

Regardless of your deployment configuration, you will have to complete the following steps.

1. Set up a MySQL server and create a schema for this project (no tables necessary - SQL Alchemy will do that). Note the following values for later.
   - DB_HOST - the url or IP address for your database
   - DB_PORT - database port (usually 3306)
   - DB_USER - login user name
   - DB_PASSWORD - login password
   - DB_SCHEMA_NAME - name of the schema you created for this
2. (Optional, but recommended for public deployment) Get a domain
   - Option 1: you can get a domain through AWS, following instructions you can find online
   - Option 2: if you get it through GoDaddy, follow these instructions: https://sandny.com/2019/11/23/host-godaddy-domain-with-aws-ec2/. Broad strokes follow.
     - AWS
       - Create a hosted zone on Route 53
       - Create one record to route traffic from your-domain.com to your deployment's static IP adddress (either the lone EC2 or the cluster's public IP)
       - Create another record to alias www.your-domain.com to your-domain.com
     - GoDaddy
       - Use custom namespace servers and put in the servers from your hosted zone (record type NS)
3. Set up authentication with Google
   - Go to https://console.cloud.google.com/apis/dashboard -> Credentials -> Create credentials
   - Follow instructions for creating new OAuth 2.0 Client IDs for a web application
   - Add your domain(s) to "Authorized JavaScript origins" (e.g. http://localhost, http://localhost:5173, and/or https://stevenmilesquant.com)
   - Note the value for "Client ID", for use with environment variables GOOGLE_CLIENT_ID later.
4. Set up your build machine (e.g. Ubuntu on your PC is fine for any configuration, but AWS EC2 instances may blow out the heap on "npm build")
   - Checkout the git repo https://github.com/SteveMilesQuant/teacherCamp.git
   - Install and start docker, and install docker-compose

## Build Docker image and push to ECR (only for AWS deployments - not localhost development deployment)

You won't need to do this for localhost deployment, but for the AWS deployments, you will build a docker image and push it up to a repo in ECR. Do all steps from your "build machine" (e.g. Ubuntu on your PC), not your AWS deployment. The "npm build" command in the dockerfile for the app will blow out the heap on some AWS EC2 instances.

1. Build docker images
   - Change directory to the git repo folder (i.e. that contains docker-compose.yml)
   - Copy ./app/.env.template to ./app/.env and update the values with values you noted before, or have chosen. No need to do this for the api; we will do this on the deployment machine(s) during the run phase.
   - Create an empty ./api/.env (or with any values). We will create a new one to be used on the deployment machine, but we need a placeholder to run the build.
   - <code>docker-compose build</code>
2. Create ECR repository, noting the URI of the repo. In this example, I have chosen the name "lul-docker-repo" for the repo, but it can be anything you choose.
3. Push the docker images you built up to the repo you created. Note that the login does not use the full URI of your repo. Note also that your region may be different.
   - <code>aws ecr get-login-password | docker login -u AWS --password-stdin https://############.dkr.ecr.us-east-1.amazonaws.com</code>
   - <code>docker tag leveluplearning_app ############.dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:leveluplearning_app</code>
   - <code>docker tag leveluplearning_api ############.dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:leveluplearning_api</code>
   - <code>docker push ############.dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:leveluplearning_app</code>
   - <code>docker push ############.dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:leveluplearning_api</code>

## New server setup

### Prerequisites

Before running the launch task, ensure the following are in place.

**`~/.ssh/lul.pem`** — EC2 key pair. In the AWS EC2 console, create a key pair named `lul` and save the downloaded `.pem` file to `~/.ssh/lul.pem`. Set permissions with `chmod 400 ~/.ssh/lul.pem`.

**`./api/.env.prod`** — Production environment file. This is copied to the EC2 instance at launch time. Create it with the following values:

```
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_SCHEMA_NAME=
SECRET_KEY=                  # any long random string used to sign JWTs
GOOGLE_CLIENT_ID=            # from Google OAuth setup (see Common set up step 3)
GOOGLE_CLIENT_SECRET=        # from Google OAuth setup
SQUARE_ACCESS_TOKEN=         # from your Square developer dashboard
SQUARE_ENVIRONMENT=          # production or sandbox
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
CONFIRMATION_EMAIL_SENDER=   # from-address for enrollment confirmation emails
API_ROOT_PATH=/api
```

**`.vscode/settings.json`** — VS Code settings consumed by the tasks. Create this file in the `.vscode/` folder with the following keys (the launch task will automatically populate `awsEc2InstanceId` and `awsEc2InstanceIPAddress` after launch):

```json
{
  "awsSecurityGroupId": "<EC2 security group ID from AWS console>",
  "gitHubOwner":        "<your GitHub username or org>",
  "gitHubRepo":         "<repository name>",
  "gitHubPat":          "<GitHub Personal Access Token>"
}
```

For the PAT: generate a **classic** token at https://github.com/settings/tokens with the **`repo` scope**. This is used to obtain a runner registration token from the GitHub API.

**GitHub Actions secrets** — Set the following under your repository's Settings → Secrets and variables → Actions:

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key with EC2 and ECR permissions |
| `AWS_SECRET_ACCESS_KEY` | Corresponding secret |
| `ECR_REGISTRY` | ECR registry host, e.g. `############.dkr.ecr.us-east-2.amazonaws.com` |
| `ECR_REPOSITORY` | ECR repository name |

### Steps

1. **Run the "Launch EC2" task** (Terminal → Run Task → Launch EC2). This script:
   - Launches a new Ubuntu t3.micro instance in `us-east-2` with a 30 GB gp3 volume using the key pair `lul`
   - Waits until both system and instance health checks pass
   - Copies `./api/.env.prod` and the `./scripts/` directory to the instance
   - Downloads and configures a GitHub Actions self-hosted runner on the instance, labeled `new-runner`, running as a systemd service
   - Writes the new instance ID and public IP back to `.vscode/settings.json` automatically (`awsEc2InstanceId` and `awsEc2InstanceIPAddress`)

2. **Run the "New Server Setup" workflow** (GitHub → Actions → New Server Setup → Run workflow). This targets the `new-runner` and:
   - Installs system packages (`unzip`, `curl`), AWS CLI, Docker, and nginx
   - Copies the nginx configuration files from `./scripts/` (`nginx.conf` and `lul_nginx_ec2.conf`) to the correct system paths
   - Adds a weekly cronjob (`0 19 * * 0`) to run the SSL certificate health check script. **IMPORTANT** Check that this worked with `crontab -l` on that machine - it can quietly fail.
   - Pulls the latest Docker images from ECR and starts the app and API containers (ports 8080 and 3000 respectively)

3. **Update Route 53**: In the AWS console, update the A record for your domain to point to the new EC2 instance's public IP address. This value is written automatically to `.vscode/settings.json` as `awsEc2InstanceIPAddress` by the launch task.

4. **Relabel the GitHub Actions runner**: Go to your repository's Settings → Actions → Runners, find the runner for the new instance, and change its label from `new-runner` to `active-deployment`. This is required for the post-routing workflow and for all future CI/CD deployments. Likewise remove `active-deployment` from your old EC2.

5. **Run the "Post-routing steps" workflow** (GitHub → Actions → Post-routing steps → Run workflow). This targets the `active-deployment` runner and:
   - Stops nginx temporarily
   - Runs certbot in standalone mode to obtain an SSL certificate from Let's Encrypt for your domain
   - Copies the certificate to `/usr/local/nginx/conf/<domain>/`
   - Restarts nginx with HTTPS enabled

The server is now fully operational with HTTPS.