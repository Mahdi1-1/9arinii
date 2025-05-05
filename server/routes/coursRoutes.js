import express from 'express';
import { 
  getCours, 
  getCoursById, 
  createCours, 
  updateCours, 
  deleteCours,
  addClasseToCours,
  removeClasseFromCours,
  getCoursByClasse
} from '../controllers/coursController.js';

const router = express.Router();

// Routes de base
router.get('/', getCours);
router.get('/:id', getCoursById);
router.post('/', createCours);
router.put('/:id', updateCours);
router.delete('/:id', deleteCours);

// Routes pour la gestion des classes associées à un cours
router.post('/:coursId/classes/:classeId', addClasseToCours);
router.delete('/:coursId/classes/:classeId', removeClasseFromCours);
router.get('/classe/:classeId', getCoursByClasse);

export default router;

