import Cours from '../models/coursModel.js';

// Obtenir tous les cours
export const getCours = async (req, res) => {
  try {
    const cours = await Cours.find()
      .populate('enseignantId', 'name email')
      .populate('classesIds', 'nom niveau');
    res.status(200).json(cours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un cours par ID
export const getCoursById = async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id)
      .populate('enseignantId', 'name email')
      .populate('classesIds', 'nom niveau');
    
    if (!cours) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }
    res.status(200).json(cours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau cours
export const createCours = async (req, res) => {
  try {
    const newCours = new Cours(req.body);
    const savedCours = await newCours.save();
    res.status(201).json(savedCours);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un cours
export const updateCours = async (req, res) => {
  try {
    const updatedCours = await Cours.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCours) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }
    res.status(200).json(updatedCours);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un cours
export const deleteCours = async (req, res) => {
  try {
    const deletedCours = await Cours.findByIdAndDelete(req.params.id);
    if (!deletedCours) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }
    res.status(200).json({ message: 'Cours supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter une classe à un cours
export const addClasseToCours = async (req, res) => {
  try {
    const { coursId, classeId } = req.params;
    
    const cours = await Cours.findById(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }
    
    // Vérifier si la classe est déjà associée au cours
    if (cours.classesIds.includes(classeId)) {
      return res.status(400).json({ message: 'Cette classe est déjà associée à ce cours' });
    }
    
    // Ajouter la classe au cours
    cours.classesIds.push(classeId);
    await cours.save();
    
    res.status(200).json(cours);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Retirer une classe d'un cours
export const removeClasseFromCours = async (req, res) => {
  try {
    const { coursId, classeId } = req.params;
    
    const cours = await Cours.findById(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }
    
    // Retirer la classe du cours
    cours.classesIds = cours.classesIds.filter(id => id.toString() !== classeId);
    await cours.save();
    
    res.status(200).json(cours);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir tous les cours d'une classe
export const getCoursByClasse = async (req, res) => {
  try {
    const { classeId } = req.params;
    
    const cours = await Cours.find({ classesIds: classeId })
      .populate('enseignantId', 'name email')
      .populate('classesIds', 'nom niveau');
      
    res.status(200).json(cours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
