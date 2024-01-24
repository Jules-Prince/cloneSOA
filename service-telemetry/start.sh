#!/bin/bash

APP="telemetry"
# Running docker image
echo "Begin: Running docker image nestjs-telemetry/$APP"

docker run nestjs-telemetry/$APP
