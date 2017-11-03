FROM openjdk:latest

COPY ./distribution/target/distribution-1.0-SNAPSHOT-bin/* /usr/src/target/
COPY ./wait-for-it.sh /usr/src/target/
COPY /dataservice/dataservice-start.sh /usr/src/target/

RUN /bin/bash -c 'chmod +x /usr/src/target/wait-for-it.sh'
RUN /bin/bash -c 'chmod +x /usr/src/target/dataservice-start.sh'

CMD /usr/src/target/dataservice-start.sh
