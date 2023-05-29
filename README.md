# Level Up Learning

FastAPI web application with MySQL database for managing the "Level Up Learning" small business for track out educational camps.

## Common set up

Regardless of your deployment configuration, you will have to complete the following steps.

1. Set up a MySQL server and create a schema for this project (no tables necessary - SQL Alchemy will do that). Note the following values for later.
   - DB_HOST - the url or IP address for your database
   - DB_PORT - database port (usually 3306)
   - DB_USER - login user name
   - DB_PASSWORD - login password
   - DB_SCHEMA_NAME - name of the schema you created for this
2. (Optional) Get a domain
   - You can get a domain through AWS
   - If you get it through GoDaddy, follow these instructions: https://sandny.com/2019/11/23/host-godaddy-domain-with-aws-ec2/. Broad strokes follow.
     - AWS
       - Create a hosted zone on Route 53
       - Create one record to route traffic from your-domain.com to your deployment's static IP adddress (either the lone EC2 or the cluster's public IP)
       - Create another record to alias www.your-domain.com to your-domain.com
     - GoDaddy
       - Use custom namespace servers and put in the servers from your hosted zone (record type NS)
3. Set up authentication with Google
   - Go to https://console.cloud.google.com/apis/dashboard -> Credentials -> Create credentials
   - Follow instructions for creating new OAuth 2.0 Client IDs for a web application
   - Add your domain(s) to "Authorized JavaScript origins" (e.g. http://localhost or https://stevenmilesquant.com)
   - Note the value for "Client ID", for use with environment variables GOOGLE_CLIENT_ID later.
4. Set up your build machine (e.g. Ubuntu on your PC is fine for any configuration)
   - Checkout the git repo https://github.com/SteveMilesQuant/teacherCamp.git

## Build Docker image and push to ECR (only for AWS deployments - not local dev deployment)

You won't need to do this for localhost deployment, but for the AWS deployments, you will build a docker image and push it up to a repo in ECR.

1. Install and start docker on your build machine
2. Build docker image
   - Change directory to the git repo folder
   - Set env variable GOOGLE_CLIENT_ID to the value you noted above.
   - <code>docker build -t lul --build-arg GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID .</code>
     - May need to run as sudo
     - This example chooses "lul" as the name of the image, but you may choose your own name
3. Create ECR repository, noting the URI of the repo. In this example, I have chosen the name "lul-docker-repo" for the repo, but it can be anything you choose.
4. Push the docker image you built up to the repo you created. Note that the login does not use the full URI of your repo. Note also that your region may be different.
   - <code>aws ecr get-login-password | sudo docker login -u AWS --password-stdin https://############.dkr.ecr.us-east-1.amazonaws.com</code>
   - <code>sudo docker tag lul ############.dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:lul</code>
   - <code>sudo docker push ############.dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:lul</code>

## Localhost development deployment

If you want to develop this locally, you can have live runs from your localhost (http://localhost), which will be faster to refresh as you make changes. Note that you will get a console error from your browser ("WebSocket connection to 'ws://localhost/' failed") that you can ignore for now. I will fix that later.

1. Configure nginx to route traffic
   - If /etc/nginx/sites-enabled does not exist
     - <code>sudo mkdir /etc/nginx/sites-enabled</code>
     - Add <code>include /etc/nginx/sirm tes-enabled/\*;</code> to the http block of /etc/nginx/nginx.conf (as sudo)
   - <code>sudo cp ./nginx/lul_nginx_localhost /etc/nginx/sites-enabled/lul_nginx</code>
   - <code>sudo service nginx restart</code>
2. Run app (front end)
   - Change directory to /app
   - Install dependencies
     - Install nodejs
     - <code>npm install</code>
   - <code>npm run dev</code>
3. Run api (back end)
   - Change directory to /api
   - Install dependencies
     - Install python3 and pip
   - (Optional, but recommended) create a virtual env for this project with the venv module
     - <code>python3 -m venv virt</code>
     - <code>source virt/bin/activate</code>
   - <code>python3 -m pip install -r ./requirements.txt</code>
   - <code>uvicorn main:app --port 8080</code>

## Single machine deployment (AWS EC2 and Docker)

If you want to get this website up and running on a single server (i.e. without scaling), this is an easy way to go before you get into Kubernetes.

### Setup

1. Create EC2 instance
   - OS: Amazon Linux is easy to connect to via AWS's web-based interface and is free, but you're welcome to use what you want
   - Instance type: t2.micro is free, to a certain degree
   - Allow both HTTP and HTTPS traffic
2. Install dependencies
   - <code>sudo yum install -y docker nginx</code>
   - <code>sudo service docker start</code>
3. Get SSL Certificates (one way is given here, but there are certainly a lot of ways to do this)
   - First, ensure your domain points to the IP address of this machine. See the "Get a domain" task in section "Common set up" above.
   - <code>python3 -m venv virt</code>
   - <code>source virt/bin/activate</code>
   - <code>python3 -m pip install --upgrade pip</code>
   - <code>python3 -m pip install certbot certbot-nginx</code>
   - <code>sudo ./virt/bin/certbot certonly --nginx</code>
   - You can put these anywhere, but ensure you have <code>chmod o+x</code> wherever you put them.
4. Configure nginx to route traffic
   - If /etc/nginx/sites-enabled does not exist
     - <code>sudo mkdir /etc/nginx/sites-enabled</code>
     - Add <code>include /etc/nginx/sites-enabled/\*;</code> to http block of /etc/nginx/nginx.conf (as sudo)
   - You may need to delete any default server in /etc/nginx/nginx.conf and run <code>sudo pkill -f nginx & wait $!</code>, if later nginx doesn't start because it's already listening on port 80
   - <code>sudo cp ./nginx/lul_nginx_ec2 /etc/nginx/sites-enabled/lul_nginx</code>
     - This step may require that you pull down the git repo, which requires you to install git
     - Since this is the only step that requires the git repo, you may wish to just type/copy it in instead
   - Update /etc/nginx/sites-enabled/lul_nginx to refer to your domain and ssl certificates
   - <code>sudo service nginx restart</code>

### Pull down and run the docker container

1. Configure log in to ECR
   - <code>aws configure</code>
   - <code>aws ecr get-login-password | sudo docker login -u AWS --password-stdin https://############.dkr.ecr.us-east-1.amazonaws.com</code>
2. <code>docker pull ############.dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:lul</code>
3. Create file for env variables (e.g. .env) with the following env variables (search in this readme for where their values come from)
   - GOOGLE_CLIENT_ID=google-client-id-from-above
   - DB_HOST=database-url
   - DB_USER=database-user
   - DB_PASSWORD=database-password
   - DB_PORT=3306
   - DB_SCHEMA_NAME=database-schema
4. <code>sudo docker run -d --env-file .env --name lul-container -p 8000:8000 ############..dkr.ecr.us-east-1.amazonaws.com/lul-docker-repo:lul</code>

## Cluster deployment (EKS and Kubernetes)

(To be continued)
