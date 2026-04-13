import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const pool = mysql.createPool(
  process.env.DATABASE_URL
    ? { uri: process.env.DATABASE_URL, waitForConnections: true, connectionLimit: 10, queueLimit: 0 }
    : {
        host: env.db.host,
        port: env.db.port,
        user: env.db.user,
        password: env.db.password,
        database: env.db.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      }
);

export default pool;
