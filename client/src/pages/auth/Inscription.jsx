import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState } from 'react';
import ImageUploader from '../../components/ImageUploader';

const API_URL = 'http://localhost:5000/api/users';

function Inscription() {
  const navigate = useNavigate();
  const [imageBase64, setImageBase64] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      date_naissance: '',
      telephone: '',
      adresse: '',
      image: '',
      diplome: '',
      status: '',
      specialite: '',
      sexe: 'homme',
    },
  });

  const role = watch('role');
  const password = watch('password');

  // Fonction pour gérer le changement d'image
  const handleImageChange = (base64Image) => {
    setImageBase64(base64Image);
    setValue('image', base64Image);
  };

  const onSubmit = async (data) => {
    // Supprimer confirmPassword car il n'est pas requis par le backend
    const { confirmPassword, ...formData } = data;

    // S'assurer que l'image est incluse
    if (imageBase64) {
      formData.image = imageBase64;
    }

    try {
      await axios.post(API_URL, formData);
      toast.success('Inscription réussie ! Veuillez vous connecter.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
      toast.error(message);
    }
  };

  return (
    <div className="page-content">
      <div className="user-form-container">
        <h2 className="user-form-title">Inscription</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nom
              </label>
              <input
                type="text"
                id="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                {...register('name', {
                  required: 'Le nom est requis',
                  minLength: {
                    value: 2,
                    message: 'Le nom doit contenir au moins 2 caractères',
                  },
                })}
              />
              {errors.name && (
                <div className="form-error">{errors.name.message}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                {...register('email', {
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Format d\'email invalide',
                  },
                })}
              />
              {errors.email && (
                <div className="form-error">{errors.email.message}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                {...register('password', {
                  required: 'Le mot de passe est requis',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
                  },
                })}
              />
              {errors.password && (
                <div className="form-error">{errors.password.message}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                {...register('confirmPassword', {
                  required: 'Veuillez confirmer le mot de passe',
                  validate: (value) =>
                    value === password || 'Les mots de passe ne correspondent pas',
                })}
              />
              {errors.confirmPassword && (
                <div className="form-error">{errors.confirmPassword.message}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Rôle
              </label>
              <select
                id="role"
                className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                {...register('role', { required: 'Le rôle est requis' })}
              >
                <option value="student">Étudiant</option>
                <option value="enseignant">Enseignant</option>
                <option value="admin">Administrateur</option>
                <option value="parent">Parent</option>
              </select>
              {errors.role && (
                <div className="form-error">{errors.role.message}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="date_naissance" className="form-label">
                Date de naissance
              </label>
              <input
                type="date"
                id="date_naissance"
                className={`form-control ${errors.date_naissance ? 'is-invalid' : ''}`}
                {...register('date_naissance', {
                  required: 'La date de naissance est requise',
                  validate: (value) => {
                    const today = new Date();
                    const birthDate = new Date(value);
                    return birthDate < today || 'La date doit être dans le passé';
                  },
                })}
              />
              {errors.date_naissance && (
                <div className="form-error">{errors.date_naissance.message}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telephone" className="form-label">
                Téléphone
              </label>
              <input
                type="tel"
                id="telephone"
                className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                {...register('telephone', {
                  required: 'Le numéro de téléphone est requis',
                  pattern: {
                    value: /^(2|5|7|9)\d{7}$/,
                    message:
                      'Le numéro doit être un numéro tunisien valide (8 chiffres, commençant par 2, 5, 7 ou 9)',
                  },
                })}
              />
              {errors.telephone && (
                <div className="form-error">{errors.telephone.message}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="adresse" className="form-label">
                Adresse
              </label>
              <input
                type="text"
                id="adresse"
                className={`form-control ${errors.adresse ? 'is-invalid' : ''}`}
                {...register('adresse', {
                  required: 'L\'adresse est requise',
                  minLength: {
                    value: 5,
                    message: 'L\'adresse doit contenir au moins 5 caractères',
                  },
                })}
              />
              {errors.adresse && (
                <div className="form-error">{errors.adresse.message}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="image" className="form-label">
                Photo de profil
              </label>
              <ImageUploader 
                currentImage={imageBase64} 
                onImageChange={handleImageChange} 
              />
              <input
                type="hidden"
                id="image"
                {...register('image', {
                  required: 'Une photo de profil est requise'
                })}
              />
              {errors.image && (
                <div className="form-error">{errors.image.message}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="sexe" className="form-label">
                Sexe
              </label>
              <select
                id="sexe"
                className={`form-select ${errors.sexe ? 'is-invalid' : ''}`}
                {...register('sexe', { required: 'Le sexe est requis' })}
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
              {errors.sexe && (
                <div className="form-error">{errors.sexe.message}</div>
              )}
            </div>
          </div>
          {(role === 'enseignant' || role === 'parent') && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Statut
                </label>
                <select
                  id="status"
                  className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                  {...register('status', {
                    required:
                      role === 'enseignant' || role === 'parent'
                        ? 'Le statut est requis'
                        : false,
                  })}
                >
                  <option value="">Sélectionner</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié">Marié</option>
                  <option value="Divorcé">Divorcé</option>
                </select>
                {errors.status && (
                  <div className="form-error">{errors.status.message}</div>
                )}
              </div>
            </div>
          )}
          {role === 'enseignant' && (
            <div className="conditional-fields">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="diplome" className="form-label">
                    Diplôme
                  </label>
                  <input
                    type="text"
                    id="diplome"
                    className={`form-control ${errors.diplome ? 'is-invalid' : ''}`}
                    {...register('diplome', {
                      required: role === 'enseignant' ? 'Le diplôme est requis' : false,
                      minLength: {
                        value: 3,
                        message: 'Le diplôme doit contenir au moins 3 caractères',
                      },
                    })}
                  />
                  {errors.diplome && (
                    <div className="form-error">{errors.diplome.message}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="specialite" className="form-label">
                    Spécialité
                  </label>
                  <input
                    type="text"
                    id="specialite"
                    className={`form-control ${errors.specialite ? 'is-invalid' : ''}`}
                    {...register('specialite', {
                      required:
                        role === 'enseignant' ? 'La spécialité est requise' : false,
                      minLength: {
                        value: 3,
                        message: 'La spécialité doit contenir au moins 3 caractères',
                      },
                    })}
                  />
                  {errors.specialite && (
                    <div className="form-error">{errors.specialite.message}</div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Inscription;
