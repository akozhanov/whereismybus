#!/usr/bin/env bash

./wait-for-it.sh wimb-ds:10000 -t 90
node main.js
