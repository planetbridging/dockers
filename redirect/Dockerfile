FROM nginx:alpine

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Environment variable
ENV TARGET_URL ${TARGET_URL}

# Replace the placeholder with the actual URL from the .env file
RUN sed -i "s|\$target|${TARGET_URL}|g" /etc/nginx/conf.d/default.conf
