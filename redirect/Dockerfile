FROM nginx:alpine

# Install envsubst
RUN apk add --no-cache gettext

# Copy the nginx configuration file template
COPY nginx.conf /etc/nginx/templates/nginx.conf.template

# Use envsubst to substitute environment variables in the template and output to the default.conf
CMD envsubst '$TARGET_URL' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
