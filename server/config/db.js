import mongoose from 'mongoose';
import chalk from 'chalk'; // Pour colorer les messages dans la console

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/9arinii');
    
    // Message de succès avec formatage coloré
    console.log(
      chalk.green.bold('✓ MongoDB connecté avec succès!') + 
      chalk.green('\n  → Serveur: ') + chalk.yellow(conn.connection.host) +
      chalk.green('\n  → Base de données: ') + chalk.yellow(conn.connection.name) +
      chalk.green('\n  → Port: ') + chalk.yellow(conn.connection.port || 'default')
    );
    
    return conn;
  } catch (error) {
    console.error(chalk.red.bold('✗ Erreur de connexion à MongoDB:'), chalk.red(error.message));
    process.exit(1);
  }
};

export default connectDB;