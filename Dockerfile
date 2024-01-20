FROM node:20.10-alpine

COPY package*.json .
RUN npm install

WORKDIR /app
COPY . . 

EXPOSE 3000
CMD ["npm run dev"]