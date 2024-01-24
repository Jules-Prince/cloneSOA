#!/bin/bash

# Building docker image
echo "Begin: Building docker image mary/payload"
docker build -t "marsy/payload" .
echo "Done: Building docker image marsy/payload"
