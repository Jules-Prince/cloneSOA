#!/bin/bash

APP="rocket-launcher"

# Building docker image
echo "Begin: Building docker image marsy/$APP"
docker build -t "marsy/$APP" .
echo "Done: Building docker image marsy/$APP"