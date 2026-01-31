import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la base de datos (Usa la URL de Render)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// --- FUNCIÓN DE CARGA AUTOMÁTICA DE PRODUCTOS ---
const inicializarDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                stock INT NOT NULL,
                category VARCHAR(100),
                icon VARCHAR(10)
            );
        `);
        const res = await pool.query('SELECT COUNT(*) FROM products');
        if (res.rows[0].count === '0') {
            await pool.query(`
                INSERT INTO products (name, price, stock, category, icon) VALUES 
                ('Aceite Girasol 1.5L', 2200, 50, 'Almacén', '🛢️'),
                ('Azúcar Classic 1kg', 900, 100, 'Almacén', '🍬'),
                ('Leche Entera Larga Vida', 1100, 80, 'Lácteos', '🥛'),
                ('Fideos Tallarín 500g', 800, 40, 'Fideos', '🍝'),
                ('Queso Cremoso 1kg', 5400, 20, 'Fiambres', '🧀');
            `);
            console.log("✅ Productos cargados automáticamente");
        }
    } catch (err) {
        console.error("Error inicializando DB:", err);
    }
};
inicializarDB();

// RUTA PARA EL CATÁLOGO
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.get('/', (req, res) => res.send('Servidor de Baratelli funcionando correctamente'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});