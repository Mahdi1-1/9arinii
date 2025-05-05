import mongoose from 'mongoose';

const jeuSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coursId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cours',
    required: true
  },
  lien: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Jeu = mongoose.model('Jeu', jeuSchema);

export default Jeu;