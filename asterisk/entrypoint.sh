#!/bin/sh
set -e

for f in /asterisk/templates/asterisk/*.template; do
  out=/etc/asterisk/$(basename "$f" .template)
  envsubst < "$f" > "$out"
  echo "Generated $out"
done
for f in /asterisk/templates/etc/*.template; do 
  out=/etc/$(basename "$f" .template)
  envsubst < "$f" > "$out"
  echo "Generated $out"
done  

echo "Waiting for MariaDB at 127.0.0.1:3306..."
# -z: scan mode (don't send data)
# -w 1: timeout after 1 second
MAX_RETRIES=30
COUNT=0

while ! nc -z -w 1 127.0.0.1 3306; do
  COUNT=$((COUNT + 1))
  if [ $COUNT -ge $MAX_RETRIES ]; then
    echo "Error: MariaDB not reachable after $MAX_RETRIES seconds. Exiting."
    exit 1
  fi
  echo "MariaDB not ready yet... (attempt $COUNT)"
  sleep 1
done
# While the database port is open, the database server might not be fully ready to accept connections.
sleep 10

chown -R asterisk:asterisk /etc/asterisk
exec /usr/sbin/asterisk -f
