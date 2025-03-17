#!/bin/bash

# Detect OS
OS="$(uname -s)"

# Get UID and GID
if [[ "$OS" == "Linux" || "$OS" == "Darwin" ]]; then
    UID_VALUE=$(id -u)
    GID_VALUE=$(id -g)
elif [[ "$OS" == "MINGW64_NT"* || "$OS" == "CYGWIN_NT"* ]]; then
    # Windows Git Bash - Use a fixed UID/GID since Windows doesn't use Linux permissions
    UID_VALUE=1000
    GID_VALUE=1000
else
    echo "Unsupported OS: $OS"
    exit 1
fi

# Create .env file
echo "UID=${UID_VALUE}" > .env
echo "GID=${GID_VALUE}" >> .env

echo "Running Docker Compose with UID=$UID_VALUE and GID=$GID_VALUE..."
docker-compose up -d
