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

