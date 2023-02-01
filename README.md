# Level Up Learning

FastAPI web application for managing the "Level Up Learning" small business for track out educational camps.

# Setup on Ubuntu

The following instructions will guide you on running a developer's instance of the Level Up Learning FastAPI website on Ubuntu.

1. Set up a python virtual environment
	* python3 -m venv virt
	* source virt/bin/activate
2. Install prerequesites
	* python3 -m pip install -r requirements.txt
3. Set up test authentication
	* Create a fake certification: mkcert localhost
	* Authorize your project with Google, so that you can login with Google
		* Go to https://console.cloud.google.com/apis/dashboard -> Credentials -> Create credentials
		* Follow instructions for creating new OAuth 2.0 Client IDs for a web application
		* Add the following URIs to this Client ID
			* https://localhost:8080
			* https://localhost:8080/signin
			* https://localhost:8080/signin/callback
		* Note/copy the value for "Client ID" and "Client secret", for use with environennt variables below
4. Set up environment variables
	* export PYTHONPATH=your-folder-path
	* export GOOGLE_CLIENT_ID=google-client-id-from-above
	* export GOOGLE_CLIENT_SECRET=google-client-secret-from-above
5. Run the application
	* uvicorn main:app --reload --port 8080 --ssl-keyfile=./localhost-key.pem --ssl-certfile=./localhost.pem
	* Navigate to https://localhost:8080/
6. For testing the API, just run pytest

