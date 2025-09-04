import Factura from "../ObtenerFactura/factura.model.js";
import pagoModel from "./pago.model.js";

export const createPago = async (req, res) => {
    try {
        console.log('🔍 Body recibido:', req.body);
        const pago = req.body;
        
        // Validar campos requeridos
        if (!pago.facturaId) {
            console.log('❌ facturaId missing');
            return res.status(400).send({
                success: false,
                message: 'facturaId is a required field.'
            });
        }

        console.log('🔍 Buscando factura con ID:', pago.facturaId);
        const factura = await Factura.findById(pago.facturaId);
        console.log('🔍 Factura encontrada:', factura);
        
        if (!factura) {
            console.log('❌ Factura no encontrada');
            return res.status(404).send({   
                success: false,
                message: 'Factura not found with the provided facturaId.'
            });
        }

        console.log('🔍 Monto factura:', factura.monto);
        console.log('🔍 Monto pago:', pago.montoPago);

        if (pago.montoPago > factura.monto) {
            console.log('❌ Monto excede saldo');
            return res.status(400).send({
                success: false,
                message: 'montoPago cannot be greater than the factura monto.'
            });
        }

        // ✅ Asignar valor por defecto si boleta no viene
        const pagoData = {
            facturaId: pago.facturaId,
            fechaPago: pago.fechaPago,
            montoPago: pago.montoPago,
            boleta: pago.boleta || ""
        };

        console.log('🔍 Creando pago con datos:', pagoData);
        const newPago = new pagoModel(pagoData);
        await newPago.save();
        console.log('✅ Pago creado:', newPago);

        factura.monto -= pago.montoPago;
        console.log('🔍 Nuevo monto factura:', factura.monto);
        await factura.save();
        console.log('✅ Factura actualizada');

        res.status(201).send({
            success: true,
            message: 'Pago created successfully',
            data: newPago
        });
    } catch (error) {
        console.error('💥 Error completo:', error);
        return res.status(500).send({
            success: false,
            message: 'Some error occurred while creating the Pago.',
            error: error.message
        });
    }
};

export const getPagos = async (req, res) => {
    try {
        const { NIT, nit } = req.query;
        let pagos;

        if (NIT || nit) {
            const nitFiltro = NIT || nit;
            const facturas = await Factura.find({ NIT: { $regex: nitFiltro, $options: 'i' } }, '_id');
            const facturaIds = facturas.map(f => f._id);

            pagos = await pagoModel.find({ facturaId: { $in: facturaIds } }).populate('facturaId');
        } else {
            pagos = await pagoModel.find().populate('facturaId');
        }

        res.status(200).send({
            success: true,
            message: 'Pagos retrieved successfully',
            data: pagos
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error al obtener los pagos',
            error: error.message
        });
    }
};