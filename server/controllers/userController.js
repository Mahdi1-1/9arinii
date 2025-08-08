import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// Obtenir tous les utilisateurs
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un utilisateur par ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouvel utilisateur
export const createUser = async (req, res) => {
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Créer le nouvel utilisateur avec le mot de passe haché
    const newUser = new User({
      ...req.body,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    
    // Retourner l'utilisateur sans le mot de passe
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    // Vérifier s'il s'agit d'une erreur de validation Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      
      // Extraire les messages d'erreur de validation
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return res.status(400).json({ 
        message: 'Erreur de validation des données',
        validationErrors
      });
    }
    
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  try {
    const userData = { ...req.body };
    
    // Si le mot de passe est fourni, le hacher
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      userData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    // Vérifier s'il s'agit d'une erreur de validation Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      
      // Extraire les messages d'erreur de validation
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return res.status(400).json({ 
        message: 'Erreur de validation des données',
        validationErrors
      });
    }
    
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les utilisateurs par rôle
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




