#!/bin/bash

APP="mission-status"

# Building docker image
echo "Begin: Building docker image marsy/$APP"
docker build -t "marsy/$APP" .
echo "Done: Building docker image marsy/$APP"
