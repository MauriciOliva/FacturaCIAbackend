import { Schema, model } from 'mongoose';

const pagoSchema = new Schema({
    fechaPago:{
        type: Date,
        required: true,
    },
    boleta:{
        type: String,
        default: "",
        trim: true,
    },
    montoPago:{
        type: Number,
        required: true,
        min: 0,
        max: 1000000000
    },
    facturaId:{
        type: Schema.Types.ObjectId,
        ref: 'Factura',
        required: true
    }
    
});

export default model('Pago', pagoSchema);