# Level Up Learning

FastAPI web application with MySQL database for managing the "Level Up Learning" small business for track out educational camps. Prior to 

## Single machine deployment (AWS EC2 and Docker)

If you want to get this website up and running on a single server (i.e. without scaling), this is an easy way to go before you get into Kubernetes.

### Setup
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
	* <code>sudo yum update</code>
	* <code>sudo yum install -y git docker nginx</code>
	* <code>sudo service docker start</code>
	* <code>git clone https://github.com/SteveMilesQuant/teacherCamp.git</code>
	* <code>cd *</code>
3. Configure nginx to route traffic
	* If /etc/nginx/sites-enabled does not exist (e.g. on Linux)
		* sudo mkdir /etc/nginx/sites-enabled
		* Add "include /etc/nginx/sirm tes-enabled/*;" to http block of /etc/nginx/nginx.conf (as sudo)
	* sudo cp nginx_template /etc/nginx/sites-enabled/leveluplearning_nginx
	* Update /etc/nginx/sites-enabled/leveluplearning_nginx to refer to your domain, your local path to ./app/dist (replacing \<app-build-directory\>), and ssl certificates
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
			* If you're just playing around, you can use mkcert localhost, and browsers will just warn traffic that it's not really secure.
			* If this is production, you will want to get a signed certificate from a certificate authority. Certbot (free) via pip instructions/commands follow.
				* <code>python3 -m venv virt</code>
				* <code>source virt/bin/activate</code>
				* <code>python3 -m pip install --upgrade pip</code>
				* <code>python3 -m pip install certbot certbot-nginx</code>
				* <code>sudo ./virt/bin/activate/certbot certonly --nginx</code>
	* sudo service nginx restart
4. Set up authentication with Google
	* Go to https://console.cloud.google.com/apis/dashboard -> Credentials -> Create credentials
	* Follow instructions for creating new OAuth 2.0 Client IDs for a web application
	* Add your domain to "Authorized JavaScript origins" (e.g. https://localhost or https://stevenmilesquant.com)
	* Note/copy the value for "Client ID", for use with environment variables GOOGLE_CLIENT_ID and and VITE_GOOGLE_CLIENT_ID below

### Build application (front end)

1. <code>cd app</code>
2. Install dependencies
	* <code>npm install</code>
3. Build
	* Create file for env variables (e.g. app/.env) with the following env variables (change VITE_API_URL if you like, but then also change ROOT_PATH below)
		* VITE_GOOGLE_CLIENT_ID=google-client-id-from-above
		* VITE_API_URL=/api
	* <code>npm run build</code>

### Deploy API (back end)

1. Create file for env variables (e.g. .env) with the following env variables (search in this readme for where their values come from)
	* GOOGLE_CLIENT_ID=google-client-id-from-above
	* DB_HOST=database-url
	* DB_USER=database-user
	* DB_PASSWORD=database-password
	* DB_PORT=3306
	* DB_SCHEMA_NAME=database-schema
	* API_ROOT_PATH=/api
2. Docker: create image and container
	* <code>sudo docker build -t level-up-learning api</code>
		* To remove: <code>sudo docker rmi level-up-learning</code>
	* <code>sudo docker run -d --env-file api/.env --name lul-container -p 8000:8000 level-up-learning</code>
		* For the first time, run without -d ("detach"), to see if there were any problems, or check the logs with <code>sudo docker logs lul-container</code>
		* To check that it's running: <code>curl 127.0.0.1:8000/api/students </code>(should return a detail with "User not logged in.", not a "Not found")
		* To remove: <code>sudo docker stop lul-container; sudo docker rm lul-container</code>
