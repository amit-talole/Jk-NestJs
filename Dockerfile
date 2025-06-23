FROM node:22-bullseye
WORKDIR /app
COPY . .
## now does not have time so copy local env 
COPY package.json ./
RUN npm install
RUN npm run prisma:generate 
RUN npm run build
EXPOSE 3100

CMD [ "npm", "run", "start"]
