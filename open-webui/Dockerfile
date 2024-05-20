# Use the open-webui image as the base
FROM ghcr.io/open-webui/open-webui:main

# Install curl
RUN apt-get update && apt-get install -y curl

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh
