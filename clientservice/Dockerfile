FROM mhart/alpine-node
WORKDIR /usr/src/app

RUN apk update
RUN apk add bash

COPY ./src/nodejs/* ./
COPY ./integration-test/wait-for-it.sh .
COPY ./integration-test/test-start.sh .

RUN /bin/sh -c 'chmod +x ./wait-for-it.sh'
RUN /bin/sh -c 'chmod +x ./test-start.sh'

RUN npm install

CMD ./test-start.sh
