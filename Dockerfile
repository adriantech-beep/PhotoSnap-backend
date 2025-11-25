FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

# Install all dependencies including devDeps for build
RUN npm install

COPY . .

# Build TypeScript
RUN npm run build

# Remove devDependencies for production
RUN npm prune --production

# Ensure runtime directories exist
RUN mkdir -p /tmp /usr/src/app/sessions /usr/src/app/sessions/zips

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/server.js"]
