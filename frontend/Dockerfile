FROM node:22

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

EXPOSE 8122

CMD ["npm", "run", "dev"]