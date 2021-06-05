FROM node:16-alpine3.13
ENV NODE_ENV=development
WORKDIR /usr/src/app/client
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
#RUN npm install --silent && mv node_modules ../
COPY . .
EXPOSE 4200 49153 
CMD ["npm", "start"]
