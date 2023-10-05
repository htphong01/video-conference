FROM node:18-alpine

WORKDIR /video-conference

COPY *.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000 

CMD ["npm", "run", "dev"]

