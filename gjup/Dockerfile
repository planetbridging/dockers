# Use the official TensorFlow GPU image as the base image
FROM tensorflow/tensorflow:latest-gpu-jupyter

# Expose the port Jupyter will run on
EXPOSE 8887

# Update package lists
RUN apt-get update && apt-get upgrade -y

# Install dependencies for PDF conversion
RUN apt-get install -y --no-install-recommends pandoc texlive-xetex texlive-fonts-recommended texlive-plain-generic

# Clean up package lists to free up space
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install additional Python packages
RUN pip install --no-cache-dir nbconvert gputil pandas plotly seaborn scikit-learn tensorboard pydot graphviz torch torchvision transformers

# Install graphviz package
RUN apt-get update && apt-get install -y --no-install-recommends graphviz && apt-get clean && rm -rf /var/lib/apt/lists/*
