FROM node:18

WORKDIR /usr/src/app

# Config files
COPY *.json .
COPY *lint* .

# Source code
COPY .husky .husky
COPY src src

# Build
RUN npm install
RUN npm install -g typescript
RUN tsc

CMD [ "node", "dist/index.js" ]
