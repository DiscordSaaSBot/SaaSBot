FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install -g typescript

COPY . .

RUN tsc

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
