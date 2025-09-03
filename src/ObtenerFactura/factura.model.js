import { Schema, model } from "mongoose";

const facturaSchema = new Schema({
    NombreCliente:{
        type: String,
        required: true,
        trim: true,
    },
    NIT:{
        type: String,
        required: true,
        trim: true
    },
    serie:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    numeroFactura:{
        type: Number,
        required: true,
        trim: true,
        unique: true
    },
    monto:{
        type: Number,
        required: true,
        trim: true,
        min: 0,
        max: 1000000000
    },
    fecha:{
        type: Date,
        required: true,
    },
    fechaPago:{
        type: Date,
        required: true,
    },
    boleta:{
        type: String,
        required: true,
        trim: true,
    },
    montoPago:{
        type: Number,
        required: true,
        trim: true,
        min: 0,
        max: 1000000000
    }

})

export default model('Factura', facturaSchema);