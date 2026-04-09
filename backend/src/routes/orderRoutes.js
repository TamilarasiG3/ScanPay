import { Router } from 'express';
import {
  confirmOrderBySession,
  createCheckoutSession,
  getMyOrders
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/checkout-session', createCheckoutSession);
router.get('/confirm/:sessionId', confirmOrderBySession);
router.get('/admin', protect, getMyOrders);

export default router;
