import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// RUTA PARA OBTENER PRODUCTOS
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener' });
    }
});

// --- NUEVA RUTA: ELIMINAR PRODUCTO ---
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.json({ message: "Producto eliminado" });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

app.get('/', (req, res) => res.send('Servidor Baratelli OK'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});