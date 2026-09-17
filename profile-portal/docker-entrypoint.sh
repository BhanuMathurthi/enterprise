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

# Discover system DNS nameservers from /etc/resolv.conf
DNS_RESOLVERS=$(grep nameserver /etc/resolv.conf 2>/dev/null | awk '{print $2}' | tr '\n' ' ')
if [ -z "$DNS_RESOLVERS" ]; then
    DNS_RESOLVERS="127.0.0.11 8.8.8.8 1.1.1.1"
fi

echo "Configuring Nginx to listen on port: ${LISTEN_PORT}"
sed -i "s|listen 80;|listen ${LISTEN_PORT};|g" /etc/nginx/conf.d/default.conf
sed -i "s|server_name localhost;|server_name _;|g" /etc/nginx/conf.d/default.conf

echo "Configuring DNS resolvers: ${DNS_RESOLVERS}"
sed -i "s|resolver 127.0.0.11 8.8.8.8 valid=10s ipv6=off;|resolver ${DNS_RESOLVERS} valid=10s ipv6=off;|g" /etc/nginx/conf.d/default.conf

echo "Configuring Nginx dynamic backend proxy target: ${BACKEND_HOST}"
sed -i "s|set \$backend_target \"http://user-management-service:8080\";|set \$backend_target \"${BACKEND_HOST}\";|g" /etc/nginx/conf.d/default.conf

if [ $# -eq 0 ]; then
    exec nginx -g "daemon off;"
else
    exec "$@"
fi
