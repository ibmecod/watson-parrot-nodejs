FROM ibmcom/ibmnode:latest

ENV NODE_ENV=production PORT=6001
EXPOSE 6001

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app

CMD [ "npm", "start" ]
