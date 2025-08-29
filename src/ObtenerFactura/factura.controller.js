import Factura from './factura.model.js';

export const createFactura = async (req, res) => {
    try {
        const factura = req.body;
        const newFactura = new Factura(factura);
        await newFactura.save();
        res.status(201).send({
            success: true,
            message: 'Factura created successfully',
            data: newFactura
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Some error occurred while creating the Factura.',
            error: error.message
        });
    }
};

export const getFacturas = async (req, res) => {
    try {
        const facturas = await Factura.find();
        res.status(200).send({
            success: true,
            message: 'Facturas retrieved successfully',
            data: facturas
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Some error occurred while retrieving the Facturas.',
            error: error.message
        });
    }  
};

export const getFacturasFiltered = async (req, res) => {
    try {
        const { fecha, serie, numeroFactura, monto } = req.query;
        const filter = {};
        if (fecha) filter.fecha = new Date(fecha);
        if (serie) filter.serie = serie;
        if (numeroFactura) filter.numeroFactura = Number(numeroFactura);
        if (monto) filter.monto = Number(monto);
        const facturas = await Factura.find(filter, 'NombreCliente NIT _id');
        res.status(200).send({
            success: true,
            message: 'Facturas retrieved successfully',
            data: facturas
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Some error occurred while retrieving the Facturas.',
            error: error.message
        });
    }
};

export const getFacturasDetalladas = async (req, res) => {
    try {
        // Obtener parámetros de filtro de la query string
        const { NIT, fecha } = req.query;
        
        // Construir objeto de filtro
        let filtro = {};
        
        if (NIT) {
            filtro.NIT = { $regex: NIT, $options: 'i' }; // Búsqueda case insensitive
        }
        
        if (fecha) {
            // Convertir la fecha a un rango de todo el día
            const fechaInicio = new Date(fecha);
            const fechaFin = new Date(fecha);
            fechaFin.setDate(fechaFin.getDate() + 1);
            
            filtro.fecha = {
                $gte: fechaInicio,
                $lt: fechaFin
            };
        }
        
        // Obtener facturas con filtros
        const facturas = await Factura.find(filtro);
        
        // Mapear para obtener solo los campos específicos que necesitas
        const facturasDetalladas = facturas.map(factura => ({
            _id: factura._id,
            idCliente: factura.Cliente ? factura.Cliente._id : null,
            NIT: factura.NIT,
            nombreCliente: factura.NombreCliente,
            fecha: factura.fecha,
            serie: factura.serie,
            numeroFactura: factura.numeroFactura,
            monto: factura.monto
        }));
        
        res.status(200).send({
            success: true,
            message: 'Facturas retrieved successfully with specific fields',
            data: facturasDetalladas
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Some error occurred while retrieving the Facturas.',
            error: error.message
        });
    }  
};

export const updateFacturaFecha = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha } = req.body;

        // Convertir a fecha y ajustar a UTC mediodía
        const fechaUTC = new Date(fecha);
        fechaUTC.setUTCHours(12, 0, 0, 0); // Mediodía UTC

        const facturaActualizada = await Factura.findByIdAndUpdate(
            id,
            { fecha: fechaUTC },
            { new: true, runValidators: true }
        );
        
        if (!facturaActualizada) {
            return res.status(404).send({
                success: false,
                message: 'Factura no encontrada'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Fecha de factura actualizada correctamente',
            data: facturaActualizada
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error al actualizar la fecha de la factura',
            error: error.message
        });
    }
};