#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "🚀 Apex Identity - Push to GitHub"
echo "=========================================================="

if [ -z "$1" ]; then
    echo "Usage: ./scripts/push-to-github.sh <GITHUB_REPOSITORY_URL>"
    echo ""
    echo "Example:"
    echo "  ./scripts/push-to-github.sh https://github.com/your-username/apex-identity.git"
    echo ""
    echo "Or simply enter your GitHub repo URL below:"
    read -p "Repo URL: " REPO_URL
else
    REPO_URL="$1"
fi

if [ -z "$REPO_URL" ]; then
    echo "❌ Error: Repository URL cannot be empty."
    exit 1
fi

echo ""
echo "Connecting local repository to: $REPO_URL"

if git remote | grep -q "^origin$"; then
    git remote set-url origin "$REPO_URL"
else
    git remote add origin "$REPO_URL"
fi

git branch -M main
echo "Pushing code to GitHub..."
git push -u origin main

echo ""
echo "=========================================================="
echo "✅ Code successfully pushed to GitHub!"
echo "=========================================================="
echo "Next step: Deploy in 1-click on your cloud platform:"
echo "👉 Render:  https://dashboard.render.com/blueprints/new (Select this repo)"
echo "👉 Railway: https://railway.app/new (Deploy from GitHub repo)"
echo "=========================================================="
