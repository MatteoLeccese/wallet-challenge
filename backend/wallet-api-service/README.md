# backend/wallet-api-service - README

## Purpose
Thin API gateway/proxy that forwards requests to the wallet DB service and injects system API key protection for internal routes.

## Prerequisites
- Node.js (v18+)
- MySql database running
- MailHog running
- The wallet-db-service running

## Setup
1. Copy env
- cp .env.example .env
- Edit `.env` and set:
  - WALLET_DB_URL (example: `http://localhost:8000/api`)
  - SYSTEM_API_KEY (Shared secret. It has to be exactly equal to the one in wallet-db-service as this is your application auth key)
  - PORT (optional)

2. Install the application
- cd backend/wallet-api-service
- npm install

## Run the application
- To run the application in development mode you can use the following command:
```bash
npm run dev
```
- To build the application for production you can use the following command:
```bash
npm run build
````
