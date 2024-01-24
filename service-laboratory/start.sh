#!/bin/bash
APP="laboratory"
# Running docker image
echo "Begin: Running docker image marsy/$APP"

docker run -p  "marsy/$APP"
