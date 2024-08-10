import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile } from '../api';
import Navbar from './Navbar';
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(currentUser.id);
        setProfile(data);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', profile.username);
      formData.append('email', profile.email);
      formData.append('first_name', profile.first_name);
      formData.append('last_name', profile.last_name);
      if (profile.image) {
        formData.append('image', profile.image); // Agrega la imagen si está presente
      }

      // Envía los datos del perfil, incluyendo la imagen si está presente
      await updateProfile(profile.user__id, formData);

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <h1 className="text-center">Profile</h1>
        <div className="profile-card mt-4">
          {isEditing ? (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
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
