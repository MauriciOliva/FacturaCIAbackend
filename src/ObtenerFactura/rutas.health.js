import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

router.get('/api', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

router.get('/database', async (req, res) => {
    try {
        const mongoose = await import('mongoose');
        const connectionState = mongoose.connection.readyState;
        
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        res.status(200).json({ 
            status: 'OK', 
            message: 'Database status',
            database: states[connectionState] || 'unknown',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'ERROR', 
            message: 'Error checking database',
            error: error.message 
        });
    }
});

export default router;