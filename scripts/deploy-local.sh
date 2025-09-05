#!/bin/bash

# Color Shader - Local Deployment Script
# This script handles clean builds and deployment preparation

set -e

echo "🚀 Starting Color Shader deployment preparation..."

# Clean previous build artifacts
echo "🧹 Cleaning previous build artifacts..."
rm -rf docs/_next/static/*/
rm -f docs/app-build-manifest.json
rm -f docs/build-manifest.json
rm -f docs/package.json
rm -f docs/prerender-manifest.json
rm -f docs/react-loadable-manifest.json
rm -f docs/routes-manifest.json
rm -rf docs/server/
rm -rf docs/static/

# Run fresh build
echo "🔨 Building application..."
npm run build

# Add only the necessary files to git
echo "📦 Adding deployment files to git..."
git add docs/index.html
git add docs/404.html
git add docs/robots.txt
git add docs/sitemap.xml
git add docs/site.webmanifest
git add docs/sitemap.txt
git add public/

echo "✅ Deployment preparation complete!"
echo "💡 Build artifacts are ignored - only essential files tracked"
echo "🎯 Ready for commit and push!"
