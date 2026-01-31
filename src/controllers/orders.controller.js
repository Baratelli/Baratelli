import { pool } from '../config/db.js'; // Los dos puntos suben a 'src' y luego entra a 'config'

export const createOrder = async (req, res) => {
  const client = await pool.connect();
  const { items } = req.body;
  const userId = req.user.id;

  try {
    await client.query('BEGIN');
    let total = 0;

    for (const item of items) {
     const result = await client.query(
  'SELECT stock, price, price_from_3 FROM products WHERE id=$1 FOR UPDATE',
  [item.product_id]
        );

      if (result.rows[0].stock < item.quantity) {
        throw new Error('Stock insuficiente');
      }

      const unitPrice =
        item.quantity >= 3
          ? result.rows[0].price_from_3
          : result.rows[0].price;

      total += unitPrice * item.quantity;

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id=$2',
        [item.quantity, item.product_id]
      );
    }

   await client.query(
  'INSERT INTO orders (customer_name, total_amount) VALUES ($1,$2)',
  [req.body.customer_name, total] // Usando los campos de tu nueva tabla
);

    await client.query('COMMIT');
    res.json({ total });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: e.message });
  } finally {
    client.release();
  }
};
