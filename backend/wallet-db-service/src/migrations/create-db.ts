import { createConnection } from 'mysql2/promise';
import { config } from 'dotenv';
config();

(async () => {
  const connection = await createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  await connection.query('CREATE DATABASE IF NOT EXISTS wallet_db');
  console.log('Database created');
  await connection.end();
})().catch((err) => {
  console.error('Error creating database:', err);
});
