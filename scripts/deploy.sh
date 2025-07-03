#!/bin/bash

# This script is run during deployment to ensure Prisma is properly set up

# Generate Prisma client
npx prisma generate

# Build the Next.js application
npm run build
