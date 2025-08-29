'use strict'

import express from "express"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import facturaRoutes from "../src/ObtenerFactura/factura.routes.js"

const config = (app)=>{
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
}

const routes = (app)=>{
    app.use('/v1/api/facturas', facturaRoutes);
}

export const initServer = ()=>{
    const app = express();
    try {
        config(app);
        routes(app);
        app.listen(process.env.PORT)
        console.log(`Servidor iniciado en el puerto ${process.env.PORT}`)
    } catch (error) {
        console.error('Server init failed', error);
    }
}
