import express from "express";
import authMiddleware from '../middleware/auth-middleware.js';
import { getSettings, updateSettings, changePassword } from '../controllers/settings-controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.put('/settings/password', changePassword);

export default router;
