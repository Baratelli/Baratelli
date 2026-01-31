import pkg from 'pg';
import dotenv from 'dotenv'; // Importante para leer el .env

dotenv.config();
const { Pool } = pkg;

// Usamos 'export default' para que coincida con tus otros archivos
// Y mejoramos la configuración de SSL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

export default pool;