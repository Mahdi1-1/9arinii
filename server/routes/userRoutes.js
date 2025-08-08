// server/routes/userRoutes.js
import express from 'express';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  getUsersByRole
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Importer le middleware

const router = express.Router();

// Routes protégées par authMiddleware
router.get('/', authMiddleware, getUsers); // Liste tous les utilisateurs
router.get('/:id', authMiddleware, getUserById); // Détails d'un utilisateur
router.put('/:id', authMiddleware, updateUser); // Mise à jour d'un utilisateur
router.delete('/:id', authMiddleware, deleteUser); // Suppression d'un utilisateur

// Routes publiques (ou avec middleware spécifique si nécessaire)
router.post('/', createUser); // Création d'utilisateur (publique pour inscription)
router.get('/role/:role', authMiddleware, getUsersByRole); // Liste par rôle

export default router;