import { Router } from 'express';
import { createOrder } from '../controllers/orders.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();
router.post('/', auth, createOrder);

export default router;
