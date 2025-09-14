import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

function Profil({ isAuthenticated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
        setUser(response.data);
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

  if (isLoading) return <div className="mt-20 mx-auto max-w-7xl w-full px-4 py-8">Chargement...</div>;
  if (!user) return <div className="mt-20 mx-auto max-w-7xl w-full px-4 py-8">Utilisateur non trouvé</div>;

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'enseignant':
        return 'bg-blue-500';
      case 'student':
        return 'bg-green-500';
      case 'parent':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="mt-20 mx-auto max-w-7xl w-full px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center p-8 bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 md:mb-0 md:mr-8 flex-shrink-0 bg-gray-100 relative">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover block" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-4xl md:text-5xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold mb-2">{user.name}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize bg-white/20 ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h3 className="text-2xl text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Email</div>
                <div className="text-lg text-gray-800 font-medium">{user.email}</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Date de naissance</div>
                <div className="text-lg text-gray-800 font-medium">
                  {new Date(user.date_naissance).toLocaleDateString()}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Téléphone</div>
                <div className="text-lg text-gray-800 font-medium">{user.telephone}</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Adresse</div>
                <div className="text-lg text-gray-800 font-medium">{user.adresse}</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Sexe</div>
                <div className="text-lg text-gray-800 font-medium">{user.sexe === 'homme' ? 'Homme' : 'Femme'}</div>
              </div>
            </div>
          </div>
          
          {(user.role === 'enseignant' || user.role === 'parent') && (
            <div className="mb-8">
              <h3 className="text-2xl text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">Informations supplémentaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.role === 'enseignant' && (
                  <>
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Diplôme</div>
                      <div className="text-lg text-gray-800 font-medium">{user.diplome}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Spécialité</div>
                      <div className="text-lg text-gray-800 font-medium">{user.specialite}</div>
                    </div>
                  </>
                )}
                {(user.role === 'enseignant' || user.role === 'parent') && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-1">Statut</div>
                    <div className="text-lg text-gray-800 font-medium">{user.status}</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <button
              className="bg-blue-500 text-white border-none px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors hover:bg-blue-600"
              onClick={() => navigate(`/users/edit/${user._id}`)}
            >
              Modifier le profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profil;
