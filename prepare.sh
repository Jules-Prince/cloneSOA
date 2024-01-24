#!/bin/bash

function compile_dir()  # $1 is the dir to get it
{
    cd $1
    bash ./build.sh
    cd ..
}

echo "** Compiling all"

compile_dir "service-missionCommander"

compile_dir "service-rocketLauncher"

compile_dir "service-rocket"

compile_dir "service-telemetry"

compile_dir "service-weatherStatus"

compile_dir "service-payloadDepartment"

compile_dir "service-payload"

compile_dir "service-stage"

compile_dir "service-webcaster"

compile_dir "service-laboratory"
sudo apt update
sudo apt install -y jq

docker compose up -d --quiet-pull 2>&1 | grep -v "init-kafka\|kafka\|cassandra\|database_telemetry\|database_payload" 
echo "** Done all"