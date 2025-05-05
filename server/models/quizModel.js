import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  texte: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    validate: {
      validator: function(options) {
        return options.length >= 2; // Au moins 2 options
      },
      message: 'Un quiz doit avoir au moins 2 options'
    }
  },
  reponseCorrecte: {
    type: String,
    required: true,
    validate: {
      validator: function(reponse) {
        return this.options.includes(reponse); // La réponse doit être dans les options
      },
      message: 'La réponse correcte doit être l\'une des options'
    }
  }
});

const quizSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  coursId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cours',
    required: true
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function(questions) {
        return questions.length > 0; // Au moins une question
      },
      message: 'Un quiz doit avoir au moins une question'
    }
  }
}, {
  timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
