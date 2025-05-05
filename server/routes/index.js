import express from 'express';
import userRoutes from './userRoutes.js';
import coursRoutes from './coursRoutes.js';
// Importez d'autres routes ici

const router = express.Router();

// Routes principales
router.use('/users', userRoutes);
router.use('/cours', coursRoutes);


export default router;

