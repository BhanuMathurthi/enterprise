#!/bin/sh
set -e

LISTEN_PORT="${PORT:-80}"
BACKEND_HOST="${BACKEND_URL:-http://user-management-service:8080}"

# Strip trailing slash if present
BACKEND_HOST="${BACKEND_HOST%/}"

# Ensure scheme is present
case "$BACKEND_HOST" in
  http://*|https://*) ;;
  *) BACKEND_HOST="http://${BACKEND_HOST}" ;;
esac

echo "Configuring Nginx to listen on port: ${LISTEN_PORT}"
sed -i "s|listen 80;|listen ${LISTEN_PORT};|g" /etc/nginx/conf.d/default.conf
sed -i "s|server_name localhost;|server_name _;|g" /etc/nginx/conf.d/default.conf

echo "Configuring Nginx backend proxy target: ${BACKEND_HOST}/api/"
sed -i "s|proxy_pass http://user-management-service:8080/api/;|proxy_pass ${BACKEND_HOST}/api/;|g" /etc/nginx/conf.d/default.conf

if [ $# -eq 0 ]; then
    exec nginx -g "daemon off;"
else
    exec "$@"
fi
