import { pool } from '../config/db.js';

export const getProducts = async (req, res) => {
  try {
    const { rows } = await pool.query(
      // Agregamos category, unit, icon y description
      'SELECT id, name, price, price_from3, stock, category, unit, icon, description FROM products WHERE stock > 0'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};