#!/usr/bin/env bash
set -e

echo "🚀 Starting Apex Identity Enterprise Suite..."
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

docker compose up -d --build

echo ""
echo "===================================================="
echo "✅ All Services Are Running Successfully!"
echo "===================================================="
echo "🌐 Frontend Portal:      http://localhost:3000"
echo "   ↳ Invitations & Mail: http://localhost:3000/legacy-demo"
echo "   ↳ New Registration:   http://localhost:3000/register"
echo "   ↳ User Profile:       http://localhost:3000/profile"
echo "⚡ Backend API:          http://localhost:8080"
echo "🗄️  Database GUI:        http://localhost:8081"
echo "===================================================="
echo "To view live logs:       docker compose logs -f user-management-service"
echo "To stop everything:      ./stop.sh (or docker compose down)"
echo "===================================================="
