# Use a base image with Node.js
FROM oven/bun

# Set the working directory inside the container
WORKDIR /app

# Accept PORT as a build-time argument
ARG PORT=8123

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the app
COPY . .

# Expose the port your application will run on
EXPOSE $PORT

# Command to run your application
CMD ["bun", "run", "index.ts"]

