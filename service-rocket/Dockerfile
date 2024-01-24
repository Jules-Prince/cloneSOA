# Base image
FROM node:18-alpine

#ENV PORT_ROCKETSTATUS 3000
#ENV PORT_ROCKETSTATUSLAUNCHER 3000
#ENV LAUNCHER_URL localhost 3000

# Create app directory
WORKDIR /usr/src/app
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Install app dependencies
RUN npm install
# Bundle app source
COPY . .
# Creates a "dist" folder with the production build
RUN npm run build
# Start the server using the production build
CMD [ "node", "dist/main.js" ]
