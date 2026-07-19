import express from "express";
import authMiddleware from '../middleware/auth-middleware.js';
import { getSettings, updateSettings, changePassword, setOwnerPin, verifyOwnerPin } from '../controllers/settings-controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.put('/settings/password', changePassword);
router.put('/settings/owner-pin', setOwnerPin);
router.post('/settings/verify-pin', verifyOwnerPin);

export default router;
