# Use ARM-compatible base image
FROM arm64v8/python:3.9-slim

# Install necessary dependencies for Jupyter and PDF export
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libatlas-base-dev \
    python3-dev \
    texlive-xetex texlive-fonts-recommended \
    pandoc \
    && pip install --no-cache-dir \
    jupyterlab \
    notebook \
    nbconvert \
    ipywidgets \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Expose Jupyter notebook port
EXPOSE 8888

# Set working directory
WORKDIR /root

# Default command to run Jupyter
CMD ["jupyter", "lab", "--ip=0.0.0.0", "--no-browser", "--allow-root"]
