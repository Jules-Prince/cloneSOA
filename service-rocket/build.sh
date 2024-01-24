#!/bin/bash
APP="rocket"
# Building docker image
echo "Begin: Building docker image marsy/$APP"
docker build --no-cache -t "marsy/$APP" .
echo "Done: Building docker image marsy/$APP"
