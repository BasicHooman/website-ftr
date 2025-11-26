# please check what version of node you are running
FROM node:18-alphine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . . 
RUN npm run build

FORM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80