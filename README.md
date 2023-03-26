# Level Up Learning

FastAPI web application with MySQL database for managing the "Level Up Learning" small business for track out educational camps.

## Setup on Ubuntu

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
3. Set up a python virtual environment (from here on, issue commands in Ubuntu)
	* python3 -m venv virt
	* source virt/bin/activate
4. Install prerequesites
	* python3 -m pip install -r requirements.txt
5. Set up test authentication
	* Create a fake certification: mkcert localhost
	* Authorize your project with Google, so that you can login with Google
		* Go to https://console.cloud.google.com/apis/dashboard -> Credentials -> Create credentials
		* Follow instructions for creating new OAuth 2.0 Client IDs for a web application
		* Add the following URIs to this Client ID
			* https://localhost:8080
			* https://localhost:8080/signin
			* https://localhost:8080/signin/callback
		* Note/copy the value for "Client ID" and "Client secret", for use with environment variables GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET below
6. Set up environment variables (perhaps put in your ~/.bash_profile on Ubuntu)
	* export PYTHONPATH=your-folder-path (i.e. the location of the directory containing this file)
	* export GOOGLE_CLIENT_ID=google-client-id-from-above
	* export GOOGLE_CLIENT_SECRET=google-client-secret-from-above
	* export DB_USER=database-user-from-above
	* export DB_PASSWORD=database-password-from-above
	* export DB_PORT=3306
	* export DB_SCHEMA_NAME=database-schema-name-from-above
	* export DB_HOST=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}')
		* This bit of code in DB_HOST is meant to get the IP address of your localhost from the perspective of Ubuntu
		* You can also find this value from Windows by running the command ipconfig, then under "Ethernet adapter vEthernet (WSL)" the value is to the right of "IPv4 Address"
7. Run the application
	* uvicorn api.main:app --reload --port 8080 --ssl-keyfile=./localhost-key.pem --ssl-certfile=./localhost.pem
	* Navigate to https://localhost:8080/
8. For automated testing of the API, just run pytest
	* Note that pytest will create, use, and delete a schema called "pytest". Feel free to change this name in ./tests/conftest.py.

## Deployment to AWS

AWS has some nice consoles you can set this all up from, but note that any of these could incur a cost. I've suggested as many of the free operations as possible, but higher usage in those tiers can still cost you.

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

1. Create AWS EC2 instance
	* Open Amazon EC2 from the AWS console
	* Select "instances"
	* Click on "Launch instances"
	* Pick an OS (e.g. Amazon Linux or Ubuntu have free tiers)
	* Pick an Instance type (t2.micro is a common free tier)
	* Click on "Create new key pair" and follow the prompts - this will download a *.pem to our PC that we can use to SSH into the instance (check your downloads)
	* Click on "Launch instance" (Note: be sure to stop and terminate the instance when you're done with it - the meter is running!)
	* Connect to your new instance by clicking on the Connect tab - the first/easiest option may not be available with Ubuntu
2. Install dependencies
	* sudo yum update
	* sudo yum install git
	* git clone https://github.com/SteveMilesQuant/teacherCamp.git
	* cd teacherCamp
	* sudo yum install docker
		* You may need to start docker: sudo service docker start
	* sudo yum install nginx
3. Build and run in docker (repeat steps for update)
	* sudo docker build -t level-up-learning .
	* create file for env variables (e.g. .env) with the following env variables (search in this readme for where their values come from)
		* GOOGLE_CLIENT_ID
		* GOOGLE_CLIENT_SECRET
		* DB_USER
		* DB_PASSWORD
		* DB_PORT
		* DB_SCHEMA_NAME
		* DB_HOST
		* Note: if you're testing this on your own PC through Ubuntu with a local MySQL instance, you may need to update the DB_HOST as follows evert time you restart your PC.
			* mv .env .env.bak
			* grep -v '^DB_HOST' .env.bak > .env
			* echo DB_HOST=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}') >> .env
			* rm .env.bak
	* sudo docker run -d --env-file .env --name lul-container -p 8080:8080 level-up-learning
		* Tip: for the first time, run without -d, to see if there were any problems


