import axios from 'axios';

// URL de base pour les requêtes d'authentification
const API_URL = '/api/auth';

// Fonction pour se connecter
export const login = async (credentials, rememberMe = false) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    
    // Stocker le token et les informations utilisateur selon le choix "Se souvenir de moi"
    if (rememberMe) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } else {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    // Configurer l'en-tête d'autorisation par défaut pour les futures requêtes
    setAuthHeader(response.data.token);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction pour se déconnecter
export const logout = () => {
  // Supprimer les données d'authentification des deux stockages
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  
  // Supprimer l'en-tête d'autorisation
  axios.defaults.headers.common['Authorization'] = '';
};

// Fonction pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = () => {
  // Vérifier d'abord dans sessionStorage, puis dans localStorage
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return !!token;
};

// Fonction pour récupérer l'utilisateur actuel
export const getCurrentUser = () => {
  // Vérifier d'abord dans sessionStorage, puis dans localStorage
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Fonction pour récupérer le token
export const getToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
};

// Fonction pour configurer l'en-tête d'autorisation
export const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Fonction pour vérifier si le token est valide
export const checkTokenValidity = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      return false;
    }
    
    // Configuration de l'en-tête avec le token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    // Appel à une route protégée pour vérifier la validité du token
    const response = await axios.get(`${API_URL}/verify-token`, config);
    return response.data.valid;
  } catch (error) {
    // Si une erreur 401 est renvoyée, le token n'est pas valide
    if (error.response && error.response.status === 401) {
      logout();
    }
    return false;
  }
};

// Initialiser l'en-tête d'autorisation au chargement du service
const token = getToken();
if (token) {
  setAuthHeader(token);
}

// Exporter toutes les fonctions
export default {
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  getToken,
  setAuthHeader,
  checkTokenValidity
};
