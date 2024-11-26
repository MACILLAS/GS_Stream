# Step 1: Build Stage
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy all necessary files for the build
COPY . .

# Set build-time variables
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_CSR_BACKEND_URL
ARG REACT_APP_REQUIRE_AUTH
ARG REACT_APP_AUTH_BACKEND_URL

# Pass environment variables to React app
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_CSR_BACKEND_URL=$REACT_APP_CSR_BACKEND_URL
ENV REACT_APP_REQUIRE_AUTH=$REACT_APP_REQUIRE_AUTH
ENV REACT_APP_AUTH_BACKEND_URL=$REACT_APP_AUTH_BACKEND_URL

# Build the project
RUN echo "Building project with REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL, REACT_APP_CSR_BACKEND_URL=$REACT_APP_CSR_BACKEND_URL, REACT_APP_REQUIRE_AUTH=$REACT_APP_REQUIRE_AUTH, and REACT_APP_AUTH_BACKEND_URL=$REACT_APP_AUTH_BACKEND_URL"

RUN npm run build

# Step 2: Production Stage
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY ./config/nginx.conf /etc/nginx/conf.d/

# Copy built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
