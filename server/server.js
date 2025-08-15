import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import chalk from 'chalk';
import authRoutes from './routes/authRoutes.js';
// Configuration des variables d'environnement - doit être appelé avant d'utiliser process.env
dotenv.config();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/auth', authRoutes);

// Middleware de débogage pour les requêtes
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentLength = req.headers['content-length'];
    console.log(`Requête ${req.method} reçue sur ${req.originalUrl}`);
    console.log(`Taille de la requête: ${(contentLength / 1024 / 1024).toFixed(2)} MB`);
    
    // Si la requête contient une image, log sa taille
    if (req.body && req.body.image) {
      console.log(`Taille de l'image: ${(req.body.image.length / 1024 / 1024).toFixed(2)} MB`);
    }
  }
  next();
});

// Afficher l'URI MongoDB (masqué pour la sécurité)
const displaySafeMongoURI = () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/9arinii';
  if (uri.includes('@')) {
    // Masquer les informations sensibles dans l'URI
    const parts = uri.split('@');
    const credentials = parts[0].split('//')[1];
    const maskedCredentials = credentials.split(':')[0] + ':****';
    return uri.replace(credentials, maskedCredentials);
  }
  return uri;
};

console.log(chalk.blue('🔌 Tentative de connexion à MongoDB Atlas:'));
console.log(chalk.blue(`   ${displaySafeMongoURI()}`));

// Connexion à MongoDB Atlas
console.log("MONGODB_URI:", process.env.MONGODB_URI);
connectDB()
  .then(() => {
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




