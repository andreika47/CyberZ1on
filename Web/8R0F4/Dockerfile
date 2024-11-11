FROM ubuntu

RUN apt-get update
RUN apt-get install nodejs -y
RUN apt-get install npm -y
RUN apt install python3 -y
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y

RUN groupadd node && useradd -m -d /home/node -g node node

USER node

RUN npm cache clean --force

WORKDIR /home/node/brofa

RUN npm install express
RUN npm install cookie-parser
RUN npm install body-parser
RUN npm install canvas
RUN npm install socket.io
RUN npm install @tensorflow/tfjs-node
RUN npm install @vladmandic/face-api 

COPY --chown=node:node . .