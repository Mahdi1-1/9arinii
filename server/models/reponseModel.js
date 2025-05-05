import mongoose from 'mongoose';

const reponseSchema = new mongoose.Schema({
  contenu: {
    type: String,
    required: true
  },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  date_creation: {
    type: Date,
    default: Date.now
  },
  est_validee: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Reponse = mongoose.model('Reponse', reponseSchema);

export default Reponse;