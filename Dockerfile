FROM node:latest

WORKDIR /app

COPY package*.json /app/

RUN npm install
RUN npm install -g nodemon

COPY . /app/

EXPOSE 3001

CMD [ "nodemon", "app.js" ]
