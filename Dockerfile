#stage 1
FROM node:20-alpine as node
WORKDIR /app
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN npm install
RUN npm run build --configuration=production
#stage 2

FROM nginx:mainline-alpine-perl
COPY --from=node /app/dist/ /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf