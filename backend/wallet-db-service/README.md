# wallet-db-service

## Purpose
Database + domain logic for customers, wallets, transactions and payment sessions. Exposes HTTP endpoints under `/api` and contains TypeORM migrations and services for payments, wallets and mailer.

## Prerequisites
- Node.js (v18+ recommended)
- MySQL server (local install or XAMPP)
- MailHog (SMTP development inbox; defaults: SMTP :1025, web UI :8025)

## Setup

1. Copy env
- cp .env.example .env
- Edit `.env` to set all the variables as needed.

2. Install
- cd backend/wallet-db-service
- npm install

3. Create the database
- The repo includes a helper script to CREATE DATABASE.
- Run:
```bash
npm run create-db
```

4. Run the database migrations
- Run:
```bash
npm run migration:run
```

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

## Create new migrations
- To create new database migration you can use the following commands:
```bash
MIGRATION_NAME=your_migration_name npm run migration:generate
```
