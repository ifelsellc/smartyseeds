#!/bin/bash

# Set npm registry to public registry
npm config set registry https://registry.npmjs.org/
npm config set always-auth false

# Install dependencies
npm install --no-fund --no-audit

# Build the project
npm run build 