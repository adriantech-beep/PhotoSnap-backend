FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

# Install all dependencies including devDeps
RUN npm install

COPY . .

# Build TS
RUN npm run build

# Remove devDependencies for production image
RUN npm prune --production

# Create dirs
RUN mkdir -p /tmp /usr/src/app/sessions /usr/src/app/sessions/zips

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/server.js"]
