#!/bin/bash

# Building docker image
echo "Begin: Building docker image nestjs-payload-department/payload-department"
docker build -t "marsy/payload-department" .
echo "Done: Building docker image nestjs-payload-department/payload-department"
