import mongoose from 'mongoose';

const coursSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  enseignantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Modification: un cours peut appartenir à plusieurs classes
  classesIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classe'
  }]
}, {
  timestamps: true
});

// Ajouter des index pour améliorer les performances des requêtes
coursSchema.index({ enseignantId: 1 });
coursSchema.index({ classesIds: 1 });

const Cours = mongoose.model('Cours', coursSchema);

export default Cours;
