FROM node:22-bullseye
WORKDIR /app
COPY . .
COPY package.json ./
RUN npm install
RUN npm run prisma:generate 
RUN npm run build
EXPOSE 3100

CMD [ "npm", "run", "start"]
