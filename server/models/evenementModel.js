import mongoose from 'mongoose';

const evenementSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  publicCible: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Evenement = mongoose.model('Evenement', evenementSchema);

export default Evenement;