#!/bin/bash

# Function to be executed on Ctrl+C
cleanup() {
  echo "Sending request to payload department to stop payload position monitoring"
  curl -X POST "http://localhost:3003/stop-telemetry"
  exit 0
}
#function on Ctrl+C
trap cleanup INT
trap cleanup SIGINT

echo "Up the services and Wait for 30s to get services ready"

#docker compose -p marsy up | awk '/INFO/' | awk '!/cassandra/' &
docker compose up --quiet-pull 2>&1 | grep -v "init-kafka\|kafka\|cassandra\|database_telemetry\|database_payload" &

# Set up trap to call cleanup f
sleep 60


################################First scenario#############################################
echo "Start the first scenario : We will launch a successful mission"
echo "Sending test request"
response=$(curl -sS "http://localhost:3005/start-mission" | cut -d'"' -f4)


until [ "$response" == "go" ]; do
  echo "Fail, the service aren't up. Wait 5s..."
  sleep 5
  echo "Retrying... Sending test request"
  response=$(curl -sS "http://localhost:3005/start-mission" | cut -d'"' -f4)

done


sleep 60

echo " retrieve all registered payload positions"

positions=$(curl -sS "http://localhost:3003/all-payload-positions" | jq '.')
echo $positions   | jq '.'
sleep 5


echo " fin du premier scénario"

################################Second scenario#############################################


echo "(appuyer pour continuer)" && read click

echo "Start the second scenario : The missionCommander wants to consult mission data"

missionlogs=$(curl -sS "http://localhost:3005/missionLogs"| jq '.' )
echo $missionlogs   | jq '.'
sleep 5

echo "Second scenario finished"


################################Third scenario#############################################

echo "(appuyer pour continuer)" && read click

echo "Start the third scenario : We will launch a mission,  but this time the rocket will fail because mission commander will give destruct order"

response1=$(curl -sS "http://localhost:3005/start-mission-failure" | cut -d'"' -f4)
sleep 40


echo "third scenario finished"



################################Fourth scenario#############################################

echo "Start the fourth scenario : this time the mission will fail because of the auto destruction"


echo "(appuyer pour continuer)" && read click



until [ "$response2" == "go" ]; do
  sleep 5
  response2=$(curl -sS "http://localhost:3005/start-mission-failure-auto-destruction" | cut -d'"' -f4)
done

sleep 40


echo "Fourth scenario finished"

################################Fifth scenario#############################################

echo "Start the second scenario : The missionCommander wants to consult mission data again after the failure"

echo "(appuyer pour continuer)" && read click

missionlogs=$(curl -sS "http://localhost:3005/missionLogs"  | jq '.' )
echo $missionlogs | jq '.'
sleep 5

################################Finish scenario#############################################

echo "Start the sixth scenario : We will re-diffuse the live of webcaster"
################################Sixth scenario#############################################

echo "(appuyer pour continuer)" && read click

docker logs  soa-marsy-marsy-23-24-team-c-web-caster-1

echo "Sixth scenario finished"

################################Finish scenario#############################################

docker-compose down
