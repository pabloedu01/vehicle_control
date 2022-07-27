FROM node:14.16

WORKDIR /app

#RUN npm install -g yarn

COPY package*.json ./
COPY yarn.lock ./

COPY . .

RUN yarn install --network-timeout 100000

#EXPOSE 3000
