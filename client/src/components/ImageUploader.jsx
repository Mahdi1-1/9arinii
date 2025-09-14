import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

function ImageUploader({ currentImage, onImageChange }) {
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Fonction pour convertir l'image en base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Validation du type de fichier
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Format de fichier non supporté. Utilisez JPG, PNG ou GIF.');
      return false;
    }
    
    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image est trop volumineuse. Taille maximale: 5MB');
      return false;
    }
    
    setError('');
    return true;
  };

  // Gestion du changement de fichier
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (validateFile(file)) {
      try {
        const base64 = await convertToBase64(file);
        setPreviewUrl(base64);
        onImageChange(base64);
      } catch (err) {
        setError('Erreur lors du traitement de l\'image');
        console.error('Erreur de conversion:', err);
      }
    }
  };

  // Gestion du clic sur le bouton
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Gestion du glisser-déposer
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    if (validateFile(file)) {
      try {
        const base64 = await convertToBase64(file);
        setPreviewUrl(base64);
        onImageChange(base64);
      } catch (err) {
        setError('Erreur lors du traitement de l\'image');
        console.error('Erreur de conversion:', err);
      }
    }
  };

  return (
    <div className="w-full mb-4">
      <div 
        className={`w-full min-h-[200px] border-2 border-dashed rounded-lg flex justify-center items-center cursor-pointer transition-all duration-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50 ${isDragging ? 'border-blue-500 bg-blue-100 scale-101 animate-pulse' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="w-full h-full relative flex justify-center items-center">
            <img src={previewUrl} alt="Aperçu" className="max-w-full max-h-[200px] object-contain rounded" />
            <button 
              type="button" 
              className="absolute bottom-2 right-2 bg-black/70 text-white border-none rounded px-3 py-1.5 text-sm cursor-pointer transition-all duration-200 flex items-center gap-1 hover:bg-black/90"
              onClick={handleButtonClick}
            >
              <i className="bi bi-arrow-repeat"></i> Changer
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center p-8 text-center text-gray-600" onClick={handleButtonClick}>
            <i className="bi bi-cloud-arrow-up-fill text-5xl mb-4 text-blue-500"></i>
            <p className="text-lg mb-2 font-medium">Cliquez ou glissez une image ici</p>
            <span className="text-sm text-gray-500">JPG, PNG ou GIF (max. 5MB)</span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
        />
      </div>
      {error && <div className="text-red-600 text-sm mt-2 pl-2">{error}</div>}
    </div>
  );
}

ImageUploader.propTypes = {
  currentImage: PropTypes.string,
  onImageChange: PropTypes.func.isRequired,
};

export default ImageUploader;
