# Dockerfile

# Use the official Node.js 16 image as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle your app's source code inside the Docker image
COPY . .

# Inform Docker that the container listens on port 3000 at runtime
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "server.js" ]
