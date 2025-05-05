import mongoose from 'mongoose';

const classeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  niveau: {
    type: String,
    trim: true
  },
  departementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departement',
    required: true
  }
}, {
  timestamps: true
});

const Classe = mongoose.model('Classe', classeSchema);

export default Classe;