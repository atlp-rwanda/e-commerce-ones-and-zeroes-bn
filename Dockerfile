FROM node:21-alpine
WORKDIR /usr/src/app
COPY . /usr/src/app
EXPOSE 7000
RUN npm install
CMD ["npm","run","dev"]