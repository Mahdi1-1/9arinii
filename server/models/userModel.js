import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'enseignant', 'parent'],
    required: true
  },
  date_naissance: {
    type: Date,
    required: true
  },
  telephone: {
    type: Number, // Correction: 'int' n'existe pas dans Mongoose, utiliser Number
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  image: {    
    type: String,
    required: true
  },
  diplome: {
    type: String,
    required: function() {
      return this.role === 'enseignant'; // Requis uniquement pour les enseignants
    }
  },
  status: {
    type: String,
    enum: ['Célibataire', 'Marié', 'Divorcé'],
    required: function() {
      return this.role === 'enseignant' || this.role === 'parent'; // Requis pour certains rôles
    }
  },
  specialite: {
    type: String,
    required: function() {
      return this.role === 'enseignant'; // Requis uniquement pour les enseignants
    }
  },
  sexe: {
    type: String,
    enum: ['homme', 'femme'],
    required: true
  }
}, {
  timestamps: true
});

// Ajouter des index pour améliorer les performances
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

export default User;

