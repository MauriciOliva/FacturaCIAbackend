'use strict'

import express from "express"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import facturaRoutes from "../src/ObtenerFactura/factura.routes.js"
import pagoRouter from "../src/PagoFactura/pago.routes.js"
import healthRoutes from "../src/ObtenerFactura/rutas.health.js"

const config = (app)=>{
    const corsOptions = {
        origin: [
            'https://factura-cia-frontend.vercel.app', 
            'http://localhost:3000',
            'https://factura-ci-abackend.vercel.app'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // ✅ Agregar PATCH
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
        optionsSuccessStatus: 200
    };
    
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions)); // ✅ Esto es importante para pre-flight
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(morgan('dev'));
}

const routes = (app)=>{
    console.log('Loading health routes...');
    app.use('/health', healthRoutes);
    
    console.log('Loading factura routes...');
    app.use('/v1/api/facturas', facturaRoutes);

    console.log('Loading pago routes...');
    app.use('/v1/api/pagos', pagoRouter);
}

export const initServer = ()=>{
    const app = express();
    try {
        config(app);
        routes(app);

        app.get('/', (req, res) => {
            res.redirect('/health');
        });

        app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                message: 'Ruta no encontrada',
                path: req.originalUrl
            });
        });

        const port = process.env.PORT || 3000;
        app.listen(port, '0.0.0.0', () => {
            console.log(`✅ Servidor iniciado en el puerto ${port}`);
            console.log(`🌐 Health check disponible en: http://localhost:${port}/health`);
        });
    } catch (error) {
        console.error('Server init failed', error);
    }
}