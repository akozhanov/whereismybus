#!/usr/bin/env bash

./wait-for-it.sh mysql:3306 -t 90
node main.js
