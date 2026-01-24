FROM node:24-alpine

WORKDIR /app

# Copy package files first for caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Create json directory structure if missing (though volume bind will override)
RUN mkdir -p json

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
