FROM nikolaik/python-nodejs:python3.9-nodejs18-alpine

RUN apk add --no-cache nginx
RUN mkdir /etc/nginx/www && chmod +r /etc/nginx/www
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /level-up-learning/app
COPY ./app/*.json /level-up-learning/app/
RUN npm install
COPY ./app /level-up-learning/app
ARG GOOGLE_CLIENT_ID
RUN echo -e "VITE_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID\nVITE_API_URL=/api" > ./.env
RUN npm run build
RUN cp -r ./dist/* /etc/nginx/www/

WORKDIR /level-up-learning/api
COPY ./api/requirements.txt /level-up-learning/api/requirements.txt
RUN python3 -m pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY ./api/*.py /level-up-learning/api/

EXPOSE 8000
RUN echo -e "#!/bin/ash\n nginx\n uvicorn main:app --host=0.0.0.0 --port 8080" > ./run.sh
RUN chmod +x ./run.sh
CMD ["./run.sh"]