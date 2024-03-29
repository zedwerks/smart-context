FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install

# Run the app
EXPOSE 8088
CMD ["npm", "start"]