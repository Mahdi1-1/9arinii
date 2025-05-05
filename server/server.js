import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';

// Configuration des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
connectDB()
  .then(() => {
    console.log('Connecté à MongoDB');
    
    // Routes API
    app.use('/api', routes);
    
    // Route de test
    app.get('/', (req, res) => {
      res.send('API est en cours d\'exécution...');
    });
    
    // Gestion des erreurs
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
    });
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
  });

