# Use small Node image
FROM node:22-alpine3.22

# Set working directory
WORKDIR /app

# Copy build folder
COPY dist .

# Install serve to serve static files
RUN npm install -g serve

# Start the server
CMD ["serve", "-s", ".", "-l", "5173"]
