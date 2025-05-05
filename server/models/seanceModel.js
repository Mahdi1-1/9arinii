import mongoose from 'mongoose';

const seanceSchema = new mongoose.Schema({
  coursId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cours',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duree: {
    type: Number,
    required: true
  },
  salle: {
    type: String,
    required: true
  },
  contenu: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Seance = mongoose.model('Seance', seanceSchema);

export default Seance;