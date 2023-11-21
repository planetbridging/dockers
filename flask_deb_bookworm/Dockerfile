# Use a base image of Debian
FROM debian:bookworm

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*

# Create a virtual environment
RUN python3 -m venv /opt/venv

# Activate virtual environment and install packages
RUN . /opt/venv/bin/activate && \
    pip3 install flask SQLAlchemy sqlacodegen python-dotenv

# Print the versions
RUN . /opt/venv/bin/activate && \
    echo "Flask version:" && flask --version && \
    echo "SQLAlchemy version:" && python3 -c "import sqlalchemy; print(sqlalchemy.__version__)" && \
    echo "sqlacodegen version:" && python3 -c "import sqlacodegen; print(getattr(sqlacodegen, '__version__', 'Version not available'))"



COPY ./engine_11.sh ./engine_11.sh
RUN chmod 744 engine_11.sh
RUN ./engine_11.sh

EXPOSE 8093

COPY ./app.py ./home/coder/project/app.py

#RUN python3 /home/coder/project/app.py



# Start an interactive shell when the container starts
CMD ["bash", "-i"]
