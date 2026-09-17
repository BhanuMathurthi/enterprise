#!/bin/sh
set -e

BACKEND_HOST="${BACKEND_URL:-http://user-management-service:8080}"

# Strip trailing slash if present
BACKEND_HOST="${BACKEND_HOST%/}"

# Ensure scheme is present
case "$BACKEND_HOST" in
  http://*|https://*) ;;
  *) BACKEND_HOST="http://${BACKEND_HOST}" ;;
esac

echo "Configuring Nginx backend proxy target: ${BACKEND_HOST}/api/"
sed -i "s|proxy_pass http://user-management-service:8080/api/;|proxy_pass ${BACKEND_HOST}/api/;|g" /etc/nginx/conf.d/default.conf

exec "$@"
