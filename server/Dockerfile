# Use official lightweight Node.js image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install packages
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the API and Socket port
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "run", "dev"]
