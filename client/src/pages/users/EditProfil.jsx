import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import ImageUploader from '../../components/ImageUploader';

const API_URL = 'http://localhost:5000/api/users';

function EditProfil({ isAuthenticated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date_naissance: '',
    telephone: '',
    adresse: '',
    image: '',
    diplome: '',
    status: '',
    specialite: '',
    sexe: 'homme',
    role: 'student',
  });
  const [imageBase64, setImageBase64] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data;
        setFormData({
          ...user,
          date_naissance: new Date(user.date_naissance).toISOString().split('T')[0],
        });
        
        // Initialiser l'image si elle existe
        if (user.image) {
          setImageBase64(user.image);
        }
      } catch (err) {
        toast.error('Erreur lors du chargement du profil');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Fonction pour gérer le changement d'image
  const handleImageChange = (base64Image) => {
    setImageBase64(base64Image);
    setFormData({ ...formData, image: base64Image });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // S'assurer que l'image est incluse
    const updatedData = { ...formData };
    if (imageBase64) {
      updatedData.image = imageBase64;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profil mis à jour avec succès');
      navigate(`/users/${id}`);
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la mise à jour';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="page-content">Chargement...</div>;

  return (
    <div className="page-content">
      <div className="user-form-container">
        <h2 className="user-form-title">Modifier le profil</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date_naissance" className="form-label">Date de naissance</label>
              <input
                type="date"
                id="date_naissance"
                name="date_naissance"
                className="form-control"
                value={formData.date_naissance}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telephone" className="form-label">Téléphone</label>
              <input
                type="number"
                id="telephone"
                name="telephone"
                className="form-control"
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="adresse" className="form-label">Adresse</label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                className="form-control"
                value={formData.adresse}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="image" className="form-label">Photo de profil</label>
              <ImageUploader 
                currentImage={imageBase64} 
                onImageChange={handleImageChange} 
              />
              <input
                type="hidden"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sexe" className="form-label">Sexe</label>
              <select
                id="sexe"
                name="sexe"
                className="form-select"
                value={formData.sexe}
                onChange={handleChange}
                required
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
            {(formData.role === 'enseignant' || formData.role === 'parent') && (
              <div className="form-group">
                <label htmlFor="status" className="form-label">Statut</label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required={formData.role === 'enseignant' || formData.role === 'parent'}
                >
                  <option value="">Sélectionner</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié">Marié</option>
                  <option value="Divorcé">Divorcé</option>
                </select>
              </div>
            )}
          </div>
          {formData.role === 'enseignant' && (
            <div className="conditional-fields">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="diplome" className="form-label">Diplôme</label>
                  <input
                    type="text"
                    id="diplome"
                    name="diplome"
                    className="form-control"
                    value={formData.diplome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="specialite" className="form-label">Spécialité</label>
                  <input
                    type="text"
                    id="specialite"
                    name="specialite"
                    className="form-control"
                    value={formData.specialite}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/users/${id}`)}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfil;
