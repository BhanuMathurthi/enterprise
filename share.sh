#!/usr/bin/env bash
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

PUBLIC_IP=$(curl -s https://loca.lt/mytunnelpassword || curl -s https://ipv4.icanhazip.com)

echo "========================================================"
echo "🌐 Apex Identity Client Demo Live Sharing"
echo "========================================================"
echo "Public URL:      https://apex-identity-demo.loca.lt"
echo "Tunnel Password: $PUBLIC_IP"
echo ""
echo "Share this with your client:"
echo "1. URL: https://apex-identity-demo.loca.lt"
echo "2. If prompted for password on first visit: $PUBLIC_IP"
echo "========================================================"
echo "Press Ctrl + C to stop sharing anytime."

npx -y localtunnel --port 3000 --subdomain apex-identity-demo
