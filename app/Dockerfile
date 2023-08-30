FROM node:18-alpine AS build-stage

WORKDIR /lul-app
COPY ./*.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM nginx:1.25-alpine
WORKDIR /lul-app
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /lul-app/dist ./

