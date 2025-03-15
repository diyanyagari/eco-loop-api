# Use an official Node.js runtime as the base image
FROM node:16


# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Use a build argument to specify the environment file
ARG ENV_FILE=.env.dev
COPY ${ENV_FILE} /app/.env

# Install dependencies
RUN npm install


# Copy the rest of the application code
COPY . .

RUN npm run migration:run

# Expose the port your app runs on (update based on your app's config)
EXPOSE 3200

# Run the app
CMD ["npm", "start"]