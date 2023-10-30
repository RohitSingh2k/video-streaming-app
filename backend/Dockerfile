FROM node:20.9.0

WORKDIR /app

COPY package*.json ./

RUN apt-get update

RUN apt-get install ffmpeg -y

RUN npm install yarn

RUN yarn install

ENV PORT=4000

COPY . .

EXPOSE 4000

CMD ["yarn", "dev"]
