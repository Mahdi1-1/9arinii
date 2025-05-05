import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  contenu: {
    type: String,
    required: true
  },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cours: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cours'
  },
  date_creation: {
    type: Date,
    default: Date.now
  },
  tags: [String]
}, {
  timestamps: true
});

const Question = mongoose.model('Question', questionSchema);

export default Question;