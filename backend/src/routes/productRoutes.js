import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getMyProducts,
  updateProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', getMyProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
