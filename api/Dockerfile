FROM node:8

# Create app directory
RUN mkdir -p /api
WORKDIR /api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /api/

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . /api

EXPOSE 8080

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

CMD /wait && npm start
