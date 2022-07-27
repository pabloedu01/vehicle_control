FROM node:14.16

WORKDIR /app

#RUN npm install -g yarn

COPY package*.json ./

COPY . .

RUN yarn install

#EXPOSE 3000
