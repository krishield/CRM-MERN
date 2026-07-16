import express from "express";
import authMiddleware from '../middleware/auth-middleware.js';
import { addCustomer, getCustomers, getCustomer, editCustomer, deleteCustomer, changeStatus } from '../controllers/customer-controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/add', addCustomer);
router.get('/allCustomer', getCustomers);
router.get('/:id', getCustomer);
router.put('/:id', editCustomer);
router.delete('/:id', deleteCustomer);
router.patch('/:id/status', changeStatus);

export default router;
