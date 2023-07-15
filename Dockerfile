FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ./package*.json ./

RUN npm install

COPY ./src ./src
COPY ./tsconfig.json ./

RUN npm run build

ENTRYPOINT ["node", "dist/index.js"]

EXPOSE 3001
