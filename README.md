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

## Localhost development deployment (Docker or npm/uvicorn)

If you want to develop this locally, you can have live runs from your localhost (http://localhost), which will be faster to refresh as you make changes. Note that you will get a console error from your browser ("WebSocket connection to 'ws://localhost/' failed") that you can ignore for now. I will fix that later.

1. Either way...
   - Change directory to the git repo folder (i.e. that contains docker-compose.yml)
   - Copy ./app/.env.template to ./app/.env and update the values with values you noted before, or have chosen, except for the following the following change.
     - VITE_API_URL=http://localhost:3000/
   - Copy ./api/.env.template to ./api/.env and update the values with values you noted before, or have chosen, except for the following the following change.
     - Delete the line with "API_ROOT_PATH". You don't need to set this here.
2. Option 1: as docker containers and open web page at http://localhost (slower turnover, but obviously easier)
   - <code>docker-compose up --build -d</code>
3. Option 2: using npm and uvicorn command lines and open web page at http://localhost:5173 (faster turnover for really active development)
   - Run app (front end)
     - Change directory to the app directory
     - Install dependencies
       - Install nodejs
       - <code>npm install</code>
     - Run the server: <code>npm run dev</code>
   - Run api (back end; separate terminal)
     - Change directory to the api direcotry
     - Install dependencies
       - Install python3 and pip
     - (Optional, but recommended) create a virtual env for this project with the venv module
       - <code>python3 -m venv virt</code>
     - (if using a virtual env, do every login) <code>source virt/bin/activate</code>
     - (only do once) <code>python3 -m pip install -r ./requirements.txt</code>
     - Convert text in .env to environment variables
       - <code>export $(grep -v '^#' .env | xargs)</code>
       - Note that <code>source .env</code> will not work because it will not set the variables for subprocesses
     - Run the server: <code>uvicorn main:app --port 3000</code>

## Single machine deployment (AWS EC2 and Docker)

If you want to get this website up and running on a single server (i.e. without scaling), this is an easy way to go before you get into Kubernetes.

### Setup

1. Create EC2 instance
   - OS: Amazon Linux is easy to connect to via AWS's web-based interface and is free, but you're welcome to use what you want
   - Instance type: t2.micro is free, to a certain degree
   - Allow both HTTP and HTTPS traffic
2. Install dependencies
   - Install docker and nginx: <code>sudo yum install -y docker nginx</code>
   - Start docker: <code>sudo service docker start</code>
   - Be sure to also do the post-install steps you can find online for docker (add your user to the "docker" group, so you don't have to keep doing everything as "sudo")
   - Additionally, install docker-compose, using steps you can Google
3. Get SSL Certificates (one way is given here using certbot, but there are certainly a lot of ways to do this)
   - First, ensure your domain points to the IP address of this machine. See the "Get a domain" task in section "Common set up" above. Certbot will ping that address and expects to reach itself running on your server.
   - Second, ensure nginx is down for the time being: <code>sudo service nginx stop</code>. Nginx will get in the way of the communication certbot is trying to do.
   - Pull down the certbot docker image, run it to generate the certificates, and copy them to the target location. (Replace <code>\<your-domain\></code> and <code>\<your-email\></code> in the block below)

```
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
LETSENCRYPT_VOLUME_DIR=$DIR/letsencrypt
DOMAIN="<your-domain>.com"
EMAIL="<your-email>"
docker run \
   --rm \
   --name certbot \
   -p 80:80 \
   -p 443:443 \
   -v "$LETSENCRYPT_VOLUME_DIR:/etc/letsencrypt" \
   certbot/certbot \
   certonly \
   -d $DOMAIN \
   --standalone \
   --email=$EMAIL \
   --agree-tos \
   --no-eff-email
sudo cp --recursive --dereference $DIR/letsencrypt/live/$DOMAIN /usr/local/nginx/conf
sudo chown $USER:$USER --recursive /usr/local/nginx/conf/$DOMAIN
```

4. Configure nginx to route traffic
   - Open /etc/nginx/nginx.conf in a text editor (e.g. <code>sudo vi /etc/nginx/nginx.conf</code>)
     - It should have a line with <code>include /etc/nginx/conf.d/\*.conf;</code>
     - If it also has a server specification below that, comment it out or delete it
   - Copy the template server configuration to the nginx location we set up
     - <code>sudo cp ~/levelUpLearning/nginx/lul_nginx_ec2.conf.template /etc/nginx/conf.d/lul_nginx_ec2.conf</code>
     - This step may require that you pull down the git repo, which requires you to install git. Since this is the only step that requires the git repo, you may wish to just type/copy it in instead
   - Update /etc/nginx/conf.d/lul_nginx_ec2.conf to refer to your domain and ssl certificates
     - <code>sudo vi /etc/nginx/conf.d/lul_nginx_ec2.conf</code>
     - Type <code>:%s/\<your-domain\>/</code> then followed by your domain name (e.g. <code>:%s/\<your-domain\>/stevenmilesquant</code>)
   - Restart nginx: <code>sudo service nginx restart</code>

### Build the docker images and push up to AWS ECR

Follow the steps in the secion above on this topic, if you haven't already. Be sure to do this on your build machine (e.g. on Ubuntu), not on you AWS EC2 instance. The build can blow out the heap on these lightweight servers.

### Pull down the images and run the docker containers

From your deployment server (e.g. AWS EC2 instance)...

1. Configure login to ECR
   - <code>aws configure</code>
   - <code>aws ecr get-login-password | docker login -u AWS --password-stdin https://############.dkr.ecr.us-east-1.amazonaws.com</code>
2. Pull down the images from the ECR repo
   - <code>docker pull ############.dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:leveluplearning_app</code>
   - <code>docker pull ############.dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:leveluplearning_api</code>
   - Note that the names "leveluplearning_app" and "leveluplearning_api" were automatically generated by docker-compose on your build machine using the name of the directory containing your docker-compose.yml file (e.g. "levelUpLearning")
3. Copy api/.env.template (from the git repo) to ~/lul.env and update the values with values you noted before, or have chosen. No need to do this for the app, since those values were absorbed during the build phase.
4. Run the containers
   - <code>docker run -d --name lul-app -p 8080:8080 ############.dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:leveluplearning_app</code>
   - <code>docker run -d --env-file ~/lul.env --name lul-api -p 3000:3000 ############.dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:leveluplearning_api</code>
