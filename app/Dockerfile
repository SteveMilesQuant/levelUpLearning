# Stage 1: Builder (common for prod & dev)
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build only if in production mode
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi


# Stage 2: Production (nginx)
FROM nginx:1.25-alpine AS production
RUN  touch /var/run/nginx.pid && \
     chown -R nginx:nginx /var/cache/nginx /var/run/nginx.pid
USER nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
WORKDIR /app
COPY --from=builder /app/dist ./
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]


# Stage 3: Development (node)
FROM node:18-alpine AS development
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 5173
CMD ["npm", "run", "dev"]