FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE ${NEXT_PUBLIC_PORT}

# Start the application
CMD ["npm", "run", "dev"]