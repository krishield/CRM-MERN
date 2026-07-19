import express from "express";
import authMiddleware from '../middleware/auth-middleware.js';
import { getSettings, updateSettings } from '../controllers/settings-controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
