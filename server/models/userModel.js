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
    enum: ['student', 'admin','enseignant', 'parent'],
    required: true
  },
  date_naissance: {
    type: Date,
    required: true
  },
  telephone: {
    type: int,
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
    required: true
  },
  status: {
    type: String,
    enum: ['Célibataire', 'Marié', 'Divorcé'],
    required: true
  },
  specialite: {
    type: String,
    required: true
  },
  sexe: {
    type: String,
    enum: ['homme', 'femme'],
    required: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;