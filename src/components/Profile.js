import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserProfile, submitUserProfileUpdate, submitProfileImageUpdate } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Profile.css';

/**
 * Componente Profile
 * 
 * Este componente maneja la visualización y edición del perfil de usuario.
 * Permite a los usuarios ver su información de perfil, editar sus datos
 * y cambiar su imagen de perfil. Las operaciones relacionadas con la API 
 * se manejan en el archivo `api.js`.
 */
const Profile = () => {
  // Obtener el usuario actual desde el contexto de autenticación
  const { currentUser } = useAuth();
  
  // Estados locales para manejar el perfil del usuario, el estado de edición y la imagen de perfil
  const [profile, setProfile] = useState({
    user__id: '',
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    image: null,
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  /**
   * useEffect para cargar el perfil del usuario cuando se monta el componente.
   * 
   * Si hay un usuario autenticado, se llama a `fetchUserProfile` desde `api.js`
   * para obtener los datos del perfil y actualizar el estado local.
   */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfile(data);
        setOriginalProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  /**
   * handleChange
   * 
   * Función para manejar los cambios en los campos de texto del formulario.
   * Actualiza el estado del perfil a medida que el usuario edita su información.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  /**
   * handleImageChange
   * 
   * Función para manejar los cambios en la selección de imagen de perfil.
   * Actualiza el estado de la imagen y marca que ha habido un cambio en la imagen.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfile((prevProfile) => ({ ...prevProfile, image: file }));
    setImageChanged(true);
  };

  /**
   * handleProfileSubmit
   * 
   * Función para manejar la actualización del perfil cuando el usuario
   * envía el formulario de edición. Se llama a `submitUserProfileUpdate`
   * desde `api.js` para enviar los datos actualizados.
   */
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitUserProfileUpdate(profile.user__id, profile, originalProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  /**
   * handleImageSubmit
   * 
   * Función para manejar la actualización de la imagen de perfil cuando
   * el usuario envía el formulario de imagen. Se llama a `submitProfileImageUpdate`
   * desde `api.js` para enviar la nueva imagen.
   */
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile.image) {
        const response = await submitProfileImageUpdate(profile.user__id, profile.image);
        console.log('Image upload response:', response);
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <h1 className="text-center">Profile</h1>
        <div className="profile-card mt-4">
          {isEditing ? (
            <div>
              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Save Profile</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>Cancel</button>
              </form>
              <form onSubmit={handleImageSubmit} className="mt-4">
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Profile Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={!imageChanged}>Save Image</button>
              </form>
            </div>
          ) : (
            <div>
              {profile.image && (
                <img 
                  src={`https://sandbox.academiadevelopers.com${profile.image}`} 
                  alt="Profile" 
                  className="profile-image" 
                />
              )}
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>First Name:</strong> {profile.first_name}</p>
              <p><strong>Last Name:</strong> {profile.last_name}</p>
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
