import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById } from '../../services/userService';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(id);
        setUser(userData);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données de l\'utilisateur');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Fonction pour afficher le rôle en français
  const formatRole = (role) => {
    const roles = {
      'student': 'Étudiant',
      'admin': 'Administrateur',
      'enseignant': 'Enseignant',
      'parent': 'Parent'
    };
    return roles[role] || role;
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) return <div className="text-center p-5">Chargement...</div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;
  if (!user) return <div className="alert alert-warning m-5">Utilisateur non trouvé</div>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h1 className="mb-0">Détails de l'utilisateur</h1>
          <div>
            <Link to={`/users/edit/${id}`} className="btn btn-warning me-2">
              Modifier
            </Link>
            <Link to="/users" className="btn btn-secondary">
              Retour à la liste
            </Link>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center mb-4">
              <img 
                src={user.image} 
                alt={user.name} 
                className="img-fluid rounded-circle mb-3" 
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
              <h3>{user.name}</h3>
              <p className="badge bg-primary">{formatRole(user.role)}</p>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <h5>Email</h5>
                  <p>{user.email}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h5>Téléphone</h5>
                  <p>{user.telephone}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h5>Date de naissance</h5>
                  <p>{formatDate(user.date_naissance)}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h5>Sexe</h5>
                  <p>{user.sexe === 'homme' ? 'Homme' : 'Femme'}</p>
                </div>
                <div className="col-md-12 mb-3">
                  <h5>Adresse</h5>
                  <p>{user.adresse}</p>
                </div>
                
                {/* Champs spécifiques aux enseignants */}
                {user.role === 'enseignant' && (
                  <>
                    <div className="col-md-6 mb-3">
                      <h5>Diplôme</h5>
                      <p>{user.diplome}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <h5>Spécialité</h5>
                      <p>{user.specialite}</p>
                    </div>
                  </>
                )}
                
                {/* Statut civil pour enseignants et parents */}
                {(user.role === 'enseignant' || user.role === 'parent') && (
                  <div className="col-md-6 mb-3">
                    <h5>Statut civil</h5>
                    <p>{user.status}</p>
                  </div>
                )}
                
                <div className="col-md-6 mb-3">
                  <h5>Date de création</h5>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h5>Dernière mise à jour</h5>
                  <p>{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;