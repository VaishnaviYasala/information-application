# Use Node LTS
FROM node:20

WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies inside container (Linux)
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
