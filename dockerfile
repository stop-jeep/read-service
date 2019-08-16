FROM node:10

WORKDIR /app

COPY ./read-service/ /app/

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]