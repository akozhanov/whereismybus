FROM openjdk:latest

COPY ./distribution/target/distribution-1.0-SNAPSHOT-bin/* /usr/src/target/

CMD java -cp '/usr/src/target/*' com.wimb.dataservice.DataService
