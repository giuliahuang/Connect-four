FROM node:16-alpine3.13
ENV NODE_ENV=development
WORKDIR /usr/src/app/client
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY . .
CMD ["npm", "start"]
