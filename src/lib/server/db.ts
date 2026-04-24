import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

// Create the connection pool. The pool-specific settings are the defaults
export const pool = mysql.createPool({
  host: env.MYSQL_HOST || 'localhost',
  user: env.MYSQL_USER || 'root',
  database: env.MYSQL_DATABASE || 'tpg_lounge',
  password: env.MYSQL_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/* 
// Example Usage in +page.server.ts:
// import { pool } from '$lib/server/db';
// 
// export async function load() {
//   const [rows, fields] = await pool.query('SELECT * FROM reservations');
//   return { reservations: rows };
// }
*/
