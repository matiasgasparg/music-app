import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile, updateProfileImage } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile({
          user__id: data.user__id,
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          image: data.image, // Ajusta si `image` es una URL completa o una ruta
        });
        setOriginalProfile({
          user__id: data.user__id,
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          image: data.image,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfile((prevProfile) => ({ ...prevProfile, image: file }));
    setImageChanged(true);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', profile.username || originalProfile.username);
      formData.append('email', profile.email || originalProfile.email);
      formData.append('first_name', profile.first_name || originalProfile.first_name);
      formData.append('last_name', profile.last_name || originalProfile.last_name);

      // Solo añadir los campos que cambian (sin incluir la imagen)
      // Enviar actualización del perfil
      await updateProfile(profile.user__id, formData);

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (profile.image) {
        formData.append('image', profile.image);
        const response = await updateProfileImage(`https://sandbox.academiadevelopers.com/users/profiles/${profile.user__id}/`, formData);
        console.log('Image upload response:', response); // Añade esta línea para depurar la respuesta
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
