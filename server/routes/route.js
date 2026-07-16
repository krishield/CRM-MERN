import express from "express";
import { addCustomer, getCustomers, getCustomer, editCustomer, deleteCustomer, changeStatus, loginForm } from '../controllers/customer-controller.js';
import { addOrder, getOrders } from '../controllers/order-controller.js';

const router = express.Router();

router.post('/add', addCustomer);
router.get('/allCustomer', getCustomers);
router.get('/:id', getCustomer);
router.put('/:id', editCustomer);
router.delete('/:id', deleteCustomer);
router.put('/:id', changeStatus);
router.post('/login', loginForm);
router.post('/addOrder', addOrder);
router.get('/allOrders', getOrders);


export default router;