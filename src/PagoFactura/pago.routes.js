import { Router } from "express"
import { createPago, getPagos } from "./pago.controller.js"

const router = Router();

router.post('/', createPago);
router.get('/', getPagos);

export default router;