import express from "express";
import authMiddleware from '../middleware/auth-middleware.js';
import { addOrder, getOrders, changeOrderStatus, deleteOrder } from '../controllers/order-controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/addOrder', addOrder);
router.get('/allOrders', getOrders);
router.patch('/order/:id/status', changeOrderStatus);
router.delete('/order/:id', deleteOrder);

export default router;
