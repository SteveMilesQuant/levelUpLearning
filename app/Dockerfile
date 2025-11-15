# Stage 1: Builder (common for prod & dev)
FROM node:18-alpine AS builder
WORKDIR /app

COPY package-lock.json ./
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
RUN npm install

COPY . .

# Stage 2: Production build (ONLY runs when target=production)
FROM builder AS build
ENV NODE_ENV=production
RUN npm run build


# Stage 3: Production (nginx)
FROM nginx:1.25-alpine AS production
RUN  touch /var/run/nginx.pid && \
     chown -R nginx:nginx /var/cache/nginx /var/run/nginx.pid
USER nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
WORKDIR /app
COPY --from=builder /app/dist ./
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]


# Stage 4: Development (node)
FROM node:18-alpine AS development
WORKDIR /app
COPY --from=build /app /app
EXPOSE 5173
CMD ["npm", "run", "dev"]