FROM mongo:latest

# Create the keyfile
RUN openssl rand -base64 756 > /etc/mongo-keyfile && \
    chmod 400 /etc/mongo-keyfile && \
    chown mongodb:mongodb /etc/mongo-keyfile
