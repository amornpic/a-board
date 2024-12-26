FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE ${APP_PORT}

CMD ["npm", "run", "start:dev"]
