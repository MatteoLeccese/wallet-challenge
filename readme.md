# Wallet Challenge — Monorepo Root

## Overview
- Contains three apps:
  - backend/wallet-db-service — database, TypeORM entities, migrations, mailer and domain logic.
  - backend/wallet-api-service — thin API gateway / proxy that forwards to the DB service and injects system API key.
  - frontend — React + Vite UI that consumes the API gateway.

## Prerequisites
- Node.js (v18+ recommended)
- MySQL server (local install or use XAMPP)
- MailHog (development SMTP; web UI default http://localhost:8025, SMTP default :1025)
- Git (optional)

## Quick setup (recommended sequence)
1. Start system dependencies
   - Start MySQL (e.g., XAMPP control panel) and create a user/database or use credentials in .env files.
   - Start MailHog to capture outgoing emails.

2. Prepare env files
   - Copy example envs in each service:
     - backend/wallet-db-service: copy .env.example → .env and set the environment variables.
     - backend/wallet-api-service: copy .env.example → .env and set the environment variables.
     - frontend: copy .env.example → .env and set the environment variables.

3. backend/wallet-db-service
   - Install deps and dev deps:
    ```bash
    cd ./backend/wallet-db-service
    npm install
    ```
   - Create the database (helper script included):
    ```bash
    npm run create-db
    ```
   - Run migrations:
    ```bash
    npm run migration:run
    ```
   - Start in dev:
    ```bash
    npm run start:dev
    ```
   - Useful scripts (if missing, add to package.json):
     - create-db -> runs src/migrations/create-db.ts
     - migration:generate -> typeorm migration:generate
     - migration:run -> typeorm migration:run
     - migration:revert -> typeorm migration:revert

4. backend/wallet-api-service
   - Install and run:
    ```bash
    cd ./backend/wallet-api-service
    npm install
    npm run start:dev
    ```

5. frontend
   - Install and run:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
