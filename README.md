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
8. For testing the API, just run pytest
	* Note that pytest will create, use, and delete a schema called "pytest". Feel free to change this name in ./tests/conftest.py.

## Deployment to AWS

AWS has some nice consoles you can set this all up from, but note that any of these could incur a cost. I've suggested as many of the free operations as possible, but higher usage in those tiers can still cost you.

### MySQL Database

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

### API

1. Create AWS resources for this API
	* IAM User
		* Open Amazon IAM
		* Click on "Add users"
		* Create a user name
		* Probably don't need to change any other settings, so just keep clicking through "next" and finally "create user"
		* Click on this user, click on "Security credentials" tab, scroll down to "Access keys"
		* Create an access key, following the prompts and noting the access key and secret for env variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY below
	* S3 bucket
		* Open Amazon S3
		* Click on Create bucket
		* Choose a name for your bucket (e.g. leveluplearning-s3bucket)
		* Note your AWS Region, for setting env variable AWS_DEFAULT_REGION below
		* Probably don't need to change any other settings, so click "Create bucket"
	* Lambda function
		* Open Amazon Lambda
		* Create
			* Click on "Create function"
			* Create a function name (e.g. leveluplearning-lambdafunction)
			* Under "Runtime", choose a version of Python
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
2. Use AWS CLI to deploy
	* Set up env variables (in Ubuntu)
		* AWS_ACCESS_KEY_ID - from the IAM User steps above, the access key
		* AWS_SECRET_ACCESS_KEY - from the IAM User steps above, the secret key
		* AWS_DEFAULT_REGION - from the S3 bucket steps above, the AWS region
	* zip -g ./api.zip -r . -x tests/**\* .git/**\* .github/**\* *.pem *.txt
	* aws s3 cp api.zip s3://leveluplearning-s3bucket/api.zip
	* aws lambda update-function-code --function-name leveluplearning-lambdafunction --s3-bucket leveluplearning-s3bucket --s3-key api.zip
3. Create your API gateway
	* Open Amazon API gateway
	* Choose to "create" or "build" a REST API
	* Click on "New API", create a name for it (e.g. LevelUpLearningAPI), and click "Create API"
	* Now that it's created, click on Actions -> Create method and choose "GET" and the check mark 
