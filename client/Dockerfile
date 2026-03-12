# Use the same lightweight Node.js Alpine image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install packages
RUN npm install

# Copy application code
COPY . .

# Expose Vite's default dev port
EXPOSE 5173

# Start Vite dev server on all network interfaces
CMD ["npm", "run", "dev", "--", "--host"]
