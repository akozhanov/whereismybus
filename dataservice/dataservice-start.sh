#!/usr/bin/env bash

/usr/src/target/wait-for-it.sh wimb-mysql:3306 -t 90
java -cp '/usr/src/target/*' com.wimb.dataservice.DataService
