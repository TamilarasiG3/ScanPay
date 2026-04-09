import { Router } from 'express';
import { login, profile, signup } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, profile);

export default router;
