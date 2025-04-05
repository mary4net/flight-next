#!/bin/bash

# # Ensure the system is up to date
# echo "Updating system packages..."
# sudo apt update && sudo apt upgrade -y
#
# # Install Node.js, npm, and SQLite3 if not already installed
# echo "Checking for Node.js installation..."
# if ! command -v node &> /dev/null
# then
#     echo "Node.js not found, installing..."
#     sudo apt install -y nodejs
# else
#     echo "Node.js is already installed."
# fi
#
# echo "Checking for npm installation..."
# if ! command -v npm &> /dev/null
# then
#     echo "npm not found, installing..."
#     sudo apt install -y npm
# else
#     echo "npm is already installed."
# fi
#
# echo "Checking for SQLite3 installation..."
# if ! command -v sqlite3 &> /dev/null
# then
#     echo "SQLite3 not found, installing..."
#     sudo apt install -y sqlite3
# else
#     echo "SQLite3 is already installed."
# fi

echo "cd my-app"
cd my-app

# Install project dependencies
echo "Installing project dependencies..."
rm -rf package-lock.json
npm install
npm install -g dotenv-cli
npm install bcrypt
npm install jsonwebtoken
npm install cookie
npm install prisma
npm install next
npm install react
npm install react-dom

# Run Prisma migrations (development mode for local setup)
echo "Running Prisma migrations..."
# export DATABASE_URL="file:./dev.db"
# npx prisma migrate dev --schema=./my-app/prisma/schema.prisma
dotenv -e ./.env -o -- npx prisma migrate dev --schema=./prisma/schema.prisma


# Set environment variable for AFS API key (adjust for your shell)
echo "Setting up environment variable for AFS_API_KEY..."
# export AFS_API_KEY="1a02bb7c959953c63a3f5960857e19d7030794b7a4c28d5c923a877bf9c034a7"

# Fetch cities and airports from AFS and save them to the database
echo "Fetching cities and airports data from AFS API..."
dotenv -e ./.env -o -- node src/scripts/fetchCityAirport.js

# Done
echo "Startup script finished."
