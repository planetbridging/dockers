# Use the official Python image as the base image
FROM python:3.9

# Set the working directory
WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    texlive-xetex \
    texlive-fonts-recommended \
    texlive-plain-generic \
    pandoc \
    tesseract-ocr \
    libleptonica-dev \
    tesseract-ocr-eng \
    tesseract-ocr-script-latn \
    libtesseract-dev \
    graphviz \
    poppler-utils

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container
COPY . .

# Expose the port Jupyter Notebook runs on
EXPOSE 8888

# Run Jupyter Notebook
CMD ["jupyter", "notebook", "--ip", "0.0.0.0", "--NotebookApp.token=LazyLoading8123!", "--notebook-dir=/notebooks", "--allow-root", "--no-browser"]