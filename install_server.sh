#!/bin/bash
echo "PORT=5000" > .env
echo "MONGO_URI=mongodb://localhost:27017/anchor_ecommerce" >> .env
echo "SECRET_KEY=$(openssl rand -base64 32)" >> .env
echo "FRONTEND_URL=http://localhost:3000" >> .env
echo "NODE_ENV=development" >> .env
npm install
node seedDatabase.js
npm run dev
