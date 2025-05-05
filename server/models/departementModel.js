import mongoose from 'mongoose';

const departementSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Departement = mongoose.model('Departement', departementSchema);

export default Departement;