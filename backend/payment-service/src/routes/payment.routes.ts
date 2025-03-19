import { Router } from 'express';
import {
  createPayment,
  getPaymentById,
  getAllPayments,
  updatePayment,
  deletePayment
} from '../controllers/payment.controller';

const router: Router = Router();

router.post('/create', createPayment);
router.get('/all', getAllPayments);
router.get('/:paymentId', getPaymentById);
router.put('/update/:paymentId', updatePayment);
router.delete('/delete/:paymentId', deletePayment);

export default router;
