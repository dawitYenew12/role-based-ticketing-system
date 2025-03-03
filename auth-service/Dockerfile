# use the official node.js 18 image with alpine linux as the base image

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# install the production dependencies
# RUN npm ci --only=production
RUN npm install

COPY . .

RUN mkdir -p logs

EXPOSE 3001

CMD ["npm", "run", "dev"]