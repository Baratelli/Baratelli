import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la base de datos usando la variable de entorno de Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(express.json());

// RUTA PARA OBTENER PRODUCTOS
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// RUTA DE PRUEBA PARA VER SI EL SERVER ESTÁ VIVO
app.get('/', (req, res) => {
    res.send('Servidor de Baratelli funcionando correctamente');
});

// ESCUCHAR EN EL PUERTO (Configuración vital para Render)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});