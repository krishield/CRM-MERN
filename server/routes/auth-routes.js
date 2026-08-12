import express from "express";
import { login, getSetupStatus, setupAdmin } from '../controllers/auth-controller.js';

const router = express.Router();

router.get('/setup-status', getSetupStatus);
router.post('/setup', setupAdmin);
router.post('/login', login);

export default router;
