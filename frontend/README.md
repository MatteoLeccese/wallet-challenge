# Wallet Challenge frontend

## Purpose
React + Vite frontend for the wallet app.

## Prerequisites
- Node.js (v18+)
- MySql database running
- MailHog running
- backend/wallet-db-service running
- backend/wallet-api-service running

## Setup

1. Copy env
- cp .env.example .env
- Edit `.env` (commonly VITE_API_BASE or similar) to point to your API (example: `VITE_API_BASE=http://localhost:3000` if the gateway runs on 3000)

2. Install  the application
- cd frontend
- npm install

## Run the application
- To run the application in development mode you can use the following command:
```bash
npm run start:dev
```
- To run the application in production mode you can use the following command:
```bash
npm run build
np run start
````

## Notes
- Ensure the API gateway is running and reachable from the browser (CORS/proxy as needed).