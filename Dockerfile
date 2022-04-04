FROM nginx:1.17.1-alpine
# Take the war and copy to webapps of tomcat
COPY dockfiles/dist/Credor /usr/share/nginx/html
