# nginx state for serving content
FROM nginx:alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets over
COPY ./www ./

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# docker stop timetracker-ui; docker rmi timetracker-ui; docker build -t timetracker-ui .; docker run -it --rm -d -p 8080:80 --name timetracker-ui nginx
# docker stop timetracker-ui; docker build -t timetracker-ui .; docker run -it --rm -p 8080:80 --name timetracker-ui nginx
# docker exec -it timetracker-ui bash
# docker system prune -af