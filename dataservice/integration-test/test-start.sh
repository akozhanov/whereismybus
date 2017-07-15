#!/usr/bin/env bash

./wait-for-it.sh wimb-dataservice:10000 -t 90
node index.js
