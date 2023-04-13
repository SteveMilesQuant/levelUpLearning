# Level Up Learning

FastAPI web application with MySQL database for managing the "Level Up Learning" small business for track out educational camps.


pytest api/tests

## Deployment on Ubuntu

The following instructions will guide you on running a developer's instance of the Level Up Learning FastAPI website on Ubuntu with a MySQL server running on your localhost.

1. Download and install MySQL Community Version (on Windows, for my exact configuration).
	* Follow the installation wizard
	* The wizard will have you create a user and password, and you should note those values for environment variables DB_USER and DB_PASSWORD below
2. Create an empty schema
	* Open MySQL Workbench and connect to your localhost instance
	* Beneath the File/Edit/View... menus is a series of icons. Hover over them to find "Create new schema..." and click on that icon
	* Pick a name for this schema, noting the name for setting environment variable DB_SCHEMA_NAME below
	* Set the charset to utf8mb4
	* Click on "Apply"
3. Set up authentication with Google
	* Go to https://console.cloud.google.com/apis/dashboard -> Credentials -> Create credentials
	* Follow instructions for creating new OAuth 2.0 Client IDs for a web application
	* Add the following URIs to this Client ID
		* https://localhost
		* https://localhost/signin
		* https://localhost/signin/callback
	* Note/copy the value for "Client ID" and "Client secret", for use with environment variables GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET below
4. Install prerequesites
	* sudo apt update
	* sudo apt install -y nginx docker
	* sudo service start nginx
	* sudo service start docker
5. Create file for env variables (e.g. .env) with the following env variables
	* GOOGLE_CLIENT_ID=google-client-id-from-above
	* GOOGLE_CLIENT_SECRET=google-client-secret-from-above
	* DB_USER=database-user-from-above
	* DB_PASSWORD=database-password-from-above
	* DB_PORT=3306
	* DB_SCHEMA_NAME=database-schema-name-from-above
	* CALLBACK_URL=https://localhost/signin/callback
6. Update .env with the IP address of MySQL server, which changes every time you restart your machine.
	* mv .env .env.bak
	* grep -v '^DB_HOST' .env.bak > .env
	* echo DB_HOST=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}') >> .env
		* This bit of code in DB_HOST is meant to get the IP address of your localhost from the perspective of Ubuntu
		* You can also find this value from Windows by running the command ipconfig, then under "Ethernet adapter vEthernet (WSL)" the value is to the right of "IPv4 Address"
	* rm .env.bak
7. Configure nginx to route traffic
	* If /etc/nginx/sites-enabled does not exist
		* sudo mkdir /etc/nginx/sites-enabled
		* Add "include /etc/nginx/sirm tes-enabled/*;" to http block of /etc/nginx/nginx.conf (as sudo)
	* Create a fake certification: mkcert localhost. Note the path of localhost.pem and localhost-key.pem.
	* Create the file /etc/nginx/sites-enabled/leveluplearning_nginx with content as follows
		server {
			listen 443 ssl http2;
			server_name localhost;
			ssl_certificate path-to-localhost.pem;
			ssl_certificate_key path-to-localhost-key.pem;
			ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
			ssl_ciphers HIGH:!aNULL:!MD5;
			location /{
					proxy_pass http://127.0.0.1:8000;
			}
		}
	* sudo service nginx restart
8. Skip to "Running with Docker" section, which is the same whether you're on Ubuntu or an EC2
	* Once your container is running, you should be able to enter https://localhost into your browser.
	* If not, check the container logs with command: sudo docker logs lul-container
9. For automated testing of the API, just run pytest. You may have to install Python 3.9 in a virtual env for this.
	* Note that pytest will create, use, and delete a schema called "pytest". Feel free to change this name in ./tests/conftest.py.

## Deployment to AWS

AWS has some nice consoles you can set this all up from, but note that any of these could incur a cost. I've suggested as many of the free operations as possible, but higher usage in those "free" tiers can still cost you.

### Basic AWS resources

Create the basic AWS resources you need for any path you choose.

1. IAM User
	* Open Amazon IAM
	* Click on "Add users"
	* Create a user name
	* Probably don't need to change any other settings, so just keep clicking through "next" and finally "create user"
	* Click on this user, click on "Security credentials" tab, scroll down to "Access keys"
	* Create an access key, following the prompts and noting the access key and secret for env variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY below
	* You will probably need to create permissions for this user. If you're just playing around, you can get away with Administrator privileges. If this is a real deployment, you may want to put in the time to ensure only what is needed (S3, Lambda, EC2, etc)
2. S3 bucket
	* Open Amazon S3
	* Click on Create bucket
	* Choose a name for your bucket (e.g. leveluplearning-s3bucket)
	* Note your AWS Region, for setting env variable AWS_DEFAULT_REGION below
	* Probably don't need to change any other settings, so click "Create bucket"

### MySQL Database

No matter which deployment you choose, you will need a MySQL database with this project.

1. Create MySQL server in Amazon
	* Open Amazon RDS
	* Click on "Create database"
	* Select "MySQL" from "Engine options"
	* Select "Free tier" from "Templates"
	* Create a master username and password, noting these values for later steps, including the env variables DB_USER and DB_PASSWORD
	* Under "Public access", select "Yes". You can pick "No" if you don't want to connect from your desktop or set up a CI/CD flow in github.
	* Click "Create database"
	* Click on this database now and note the "Endpoint" for later env variable DB_HOST and the "Port" for DB_PORT
2. Connect and configure from your desktop
	* Open MySQL Workbench on your PC (or any other database/SQL interface program)
	* Create a new connection using the host name you noted above, user, and password
	* Create a new schema, choosing the name yourself (don't forget to use charset utf8mb4). Note this name for later env variable DB_SCHEMA_NAME.

### Lambda Deployment

You can choose to deploy this API as an AWS Lambda function, which is kind of a cool concept. As you get an API request, AWS spins up your Lambda and uses it to respond. Although there is a free tier, you only get charged for the volume of requests that need to be served. It's super easy to create one of these, but I did find the api on the free-tier Lambda to be a bit sluggish.

1. Create AWS Lambda function
	* Open Amazon Lambda
	* Create new Lambda
		* Click on "Create function"
		* Create a function name (e.g. leveluplearning-lambdafunction)
		* Under "Runtime", choose a version of Python - IMPORTANT! This version must match the version you're using, so you may have to update your python.
		* Probably don't need to change any other settings, so click "Create function"
	* Change handler
		* Now click on the function you just created and scroll down to "Runtime settings"
		* Edit it those settings to change the handler to "api.main.handler"
	* Create env variables
		* Click on the "Configuration" tab, then "Environment variables", then edit
		* Add the following environment variables
			* DB_HOST - the user host from when you created the MySQL server
			* DB_USER - the user from when you created the MySQL server
			* DB_PASSWORD - the user password from when you created the MySQL server
			* DB_PORT - 3306 (or perhaps something different - go to your database in RDS to find out)
			* DB_SCHEMA_NAME - the schema you created when configuring your MySQL server
			* SECRET_KEY - choose a number, any number
			* GOOGLE_CLIENT_ID - same value as before
			* GOOGLE_CLIENT_SECRET - same value as before
2. Use AWS CLI to deploy (command lines in Ubuntu)
	* Set up env variables
		* AWS_ACCESS_KEY_ID - from the IAM User steps above, the access key
		* AWS_SECRET_ACCESS_KEY - from the IAM User steps above, the secret key
		* AWS_DEFAULT_REGION - from the S3 bucket steps above, the AWS region
	* source virt/bin/activate
	* cd ./virt/lib/python3.9/site-packages
	* zip -r9 ../../../../api.zip .
	* cd ../../../..
	* zip -g ./api.zip -r . -x tests/**\* .git/**\* .github/**\* *.pem *.txt
	* aws s3 cp api.zip s3://leveluplearning-s3bucket/api.zip
	* aws lambda update-function-code --function-name leveluplearning-lambdafunction --s3-bucket leveluplearning-s3bucket --s3-key api.zip
3. Generate URL
	* Go back to your lambda function in Amazon Lambda
	* Click on the "Configuration" tab, then "Function URL", then "Create function URL"
	* For Auth type, click "NONE"
	* Check the "Configure cross-origin resource sharing (CORS)
	* Click "Save" and you should get a URL you can visit
4. Allow access to this URL from Google
	* Retrace your steps with "Set up test authentication" above and instead use the URL just generated by AWS
	* You may need to add an additional URL for the callback, as I found it would insert "cell-1-" into the original URL for some reason
5. (Bonus) CI/CD: you can see how you might manage CI/CD for this through github by looking at ./.github/workflows/lambda-cicd-pipeline.yml

### EC2 Deployment with Docker

If you want to get this website up and running on a single server (i.e. without scaling), this is an easy way to go before you have to get into Kubernetes and whatnot. If you're already comfortable with Docker, this may be the preferred way for you to launch uvicorn even on your PC through Ubuntu (skipping the nginx part), but you will have to edit the Dockerfile to get uvicorn to use your certification files (i.e. localhost.pem and localhost-key.pem). Note that EC2 deployment requires that you have purchased a domain for yourself, since Google's white list for authentication doesn't allow IP addresses.

1. Create AWS EC2 instance
	* Open Amazon EC2 from the AWS console
	* Select "instances"
	* Click on "Launch instances"
	* Pick an OS (e.g. Amazon Linux or Ubuntu have free tiers)
	* Pick an Instance type (t2.micro is a common free tier)
	* Click on "Create new key pair" and follow the prompts - this will download a *.pem to our PC that we can use to SSH into the instance (check your downloads)
	* Check the box for "Allow HTTPS traffic from the internet"
	* Also check the box for "Allow HTTP traffic from the internet", since we will redirect regular http to https
	* Click on "Launch instance" (Note: be sure to stop and terminate the instance when you're done with it - the meter is running!)
	* Connect to your new instance by clicking on the Connect tab - the first/easiest option to use the AWS web interface may not be available with Ubuntu, so you may instead use ssh
2. Install dependencies (shown as yum commands, since this is what AWS Linux uses)
	* sudo yum update
	* sudo yum install -y git docker nginx
	* sudo service docker start
	* git clone https://github.com/SteveMilesQuant/teacherCamp.git
	* cd *
3. Create file for env variables (e.g. .env) with the following env variables (search in this readme for where their values come from)
	* GOOGLE_CLIENT_ID
	* GOOGLE_CLIENT_SECRET
	* DB_USER
	* DB_PASSWORD
	* DB_PORT
	* DB_SCHEMA_NAME
	* DB_HOST
	* CALLBACK_URL - needs to be the final domain-specific URL for the callback (e.g. https://your-domain.com/signin/callback)
4. Configure nginx to route traffic
	* If /etc/nginx/sites-enabled does not exist (e.g. on Linux)
		* sudo mkdir /etc/nginx/sites-enabled
		* Add "include /etc/nginx/sirm tes-enabled/*;" to http block of /etc/nginx/nginx.conf (as sudo)
	* sudo cp nginx_template /etc/nginx/sites-enabled/leveluplearning_nginx
	* Update /etc/nginx/sites-enabled/leveluplearning_nginx to refer to your domain and ssl certificates
		* Domain
			* You can get a domain through AWS
			* If you get it through GoDaddy, follow these instructions: https://sandny.com/2019/11/23/host-godaddy-domain-with-aws-ec2/. Broad strokes follow.
				* AWS
					* Create a hosted zone on Route 53
					* Create one record to route traffic from your-domain.com to your EC2's IP adddress
					* Create another record to alias www.your-domain.com to your-domain.com
				* GoDaddy
					* Use custom namespace servers and put in the servers from your hosted zone (record type NS)
		* SSL Certificates
			* If you're just playing around, you can use mkcert localhost, as before, and browsers will just warn traffic that it's not really secure.
			* If this is production, you will want to get a signed certificate from a certificate authority. Certbot (free) via pip instructions/commands follow.
				* python3 -m venv virt
				* source virt/bin/activate
				* python3 -m pip install --upgrade pip
				* python3 -m pip install certbot certbot-nginx
				* sudo ./virt/bin/activate/certbot certonly --nginx
	* sudo service nginx restart
5. Set up authentication with Google
	* Add the necessary URIs to Google's white list (see "Set up authentication with Google" above for Ubuntu, except use your domain as the base URL)
6. Skip to "Running with Docker" section, which is the same whether you're on Ubuntu or an EC2

## Running with Docker

* sudo docker build -t level-up-learning .
	* To remove: sudo docker rmi level-up-learning
* sudo docker run -d --env-file .env --name lul-container -p 8000:8000 level-up-learning
	* For the first time, run without -d ("detach"), to see if there were any problems, or check the logs with "sudo docker logs lul-container"
	* To check that it's running: curl 127.0.0.1:8000
	* To remove: sudo docker stop lul-container; sudo docker rm lul-container