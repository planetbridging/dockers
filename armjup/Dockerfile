# Use ARM-compatible base image
FROM arm64v8/python:3.9-slim

# Install necessary dependencies for Jupyter, LaTeX, and PDF export
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libatlas-base-dev \
    python3-dev \
    texlive-xetex texlive-fonts-recommended texlive-plain-generic texlive-latex-extra \
    pandoc \
    graphviz \
    wkhtmltopdf \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt if using pip dependencies
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install nbconvert and its dependencies for PDF conversion
RUN pip install nbconvert[webpdf] pyppeteer

# Expose Jupyter notebook port
EXPOSE 8888

# Set working directory
WORKDIR /root

# Default command to run Jupyter Lab
CMD ["jupyter", "lab", "--ip=0.0.0.0", "--no-browser", "--allow-root", "--notebook-dir=/root/notebooks"]
