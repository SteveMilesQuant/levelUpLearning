FROM python:3.9
WORKDIR /level-up-learning
COPY ./requirements.txt /level-up-learning/requirements.txt
RUN python3 -m pip install --no-cache-dir --upgrade -r /level-up-learning/requirements.txt
COPY ./api /level-up-learning/api
COPY ./images /level-up-learning/images
COPY ./static /level-up-learning/static
COPY ./js /level-up-learning/js
COPY ./templates /level-up-learning/templates
#COPY ./localhost-key.pem /level-up-learning/localhost-key.pem
#COPY ./localhost.pem /level-up-learning/localhost.pem
#EXPOSE 8080
#CMD ["uvicorn", "api.main:app", "--host=0.0.0.0", "--port", "8080", "--ssl-keyfile=./localhost-key.pem", "--ssl-certfile=./localhost.pem"]
EXPOSE 8000
CMD ["uvicorn", "api.main:app", "--host=0.0.0.0", "--port", "8000"]