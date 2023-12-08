# Use a base image with Node.js and Bun
FROM oven/bun

# Set the working directory inside the container
WORKDIR /app

# Accept PORT as a build-time argument
ARG PORT=9444

# Copy package files from the 'back' directory
COPY back/package.json back/bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the app from the 'back' directory
COPY back/ .

# Expose the port your application will run on
EXPOSE $PORT

# Command to run your application
CMD ["bun", "run", "index.ts"]
