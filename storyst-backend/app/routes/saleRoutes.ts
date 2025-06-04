import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import { 
    createSale, 
    getDailySalesStatistics, 
    getTopAverageValueCustomer, 
    getTopFrequencyCustomer, 
    getTopVolumeCustomer 
} from '../controllers/saleController';

const router = Router();

router.post('/', authMiddleware, createSale);
router.get('/statistics/daily', authMiddleware, getDailySalesStatistics);
router.get('/statistics/top-volume-customer', authMiddleware, getTopVolumeCustomer);
router.get('/statistics/top-avg-value-customer', authMiddleware, getTopAverageValueCustomer);
router.get('/statistics/top-frequency-customer', authMiddleware, getTopFrequencyCustomer);

export default router;