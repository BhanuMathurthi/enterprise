#!/usr/bin/env bash
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

echo "🛑 Stopping all Apex Identity services..."
docker compose down
echo "✅ All containers stopped."
