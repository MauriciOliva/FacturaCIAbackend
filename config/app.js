'use strict'

import express from "express"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import facturaRoutes from "../src/ObtenerFactura/factura.routes.js"
import healthRoutes from "../src/ObtenerFactura/rutas.health.js"

const config = (app)=>{
    const corsOptions = {
        origin: function (origin, callback) {
            const allowedOrigins = [
                'https://factura-cia-frontend.vercel.app',
                'http://localhost:3000',
                'https://factura-ci-abackend.vercel.app',
                'https://factura-cla-frontend.vercel.app' // por si acaso
            ];
            
            // Permitir solicitudes sin origen (como apps móviles o curl)
            if (!origin) return callback(null, true);
            
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log('Origen bloqueado por CORS:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
        optionsSuccessStatus: 200
    };
    
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
    
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