FROM mhart/alpine-node
WORKDIR /integration

COPY package.json .
COPY index.js .
COPY wait-for-it.sh .
COPY test-start.sh .

RUN apk update
RUN apk add bash

RUN /bin/sh -c 'chmod +x ./wait-for-it.sh'
RUN /bin/sh -c 'chmod +x ./test-start.sh'

RUN npm install

CMD ./test-start.sh
