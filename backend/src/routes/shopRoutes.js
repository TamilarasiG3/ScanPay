import { Router } from 'express';
import { generateShopQr, getShopBySlug } from '../controllers/shopController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/admin/qr', protect, generateShopQr);
router.get('/:shopSlug', getShopBySlug);

export default router;
