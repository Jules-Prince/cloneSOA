#!/bin/bash
APP="weather-status"
# Running docker image
echo "Begin: Running docker image nestjs-weatherStatus/$APP"

docker run -p  "nestjs-weather-status/$APP"
