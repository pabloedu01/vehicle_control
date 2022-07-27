FROM node:14.16

WORKDIR /app

#RUN npm install -g yarn

COPY package*.json ./
COPY yarn.lock ./

COPY . .

RUN yarn config delete proxy
RUN npm config rm proxy
RUN npm config rm https-proxy

RUN yarn --no-lockfile --network-timeout 100000

#EXPOSE 3000
