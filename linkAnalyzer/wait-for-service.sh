#!/usr/bin/env sh

set -e

host="$1"
port="$2"
cmd="$3"

echo 'Inspecting' $host $port

until $(telnet $host $port); do
	>&2 echo "Service not Available yet - trying"
	sleep 5
done

>&2 echo "Service is working! Yippie!"

sleep 1

exec $cmd