#!/usr/bin/env bash

# Generate Prisma client first
echo "Generating Prisma client..."
bunx prisma generate

# Then run the update script
echo "Running update-featured-post script..."
bun run scripts/update-featured-post.js
