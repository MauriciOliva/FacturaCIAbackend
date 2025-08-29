import {Router} from 'express';
import { createFactura,getFacturas, getFacturasDetalladas, updateFacturaFecha} from './factura.controller.js';

const router =Router();

router.post('/', createFactura);
router.get('/', getFacturas);
router.get('/detailed', getFacturasDetalladas);
router.patch('/:id/fecha', updateFacturaFecha);

export default router;