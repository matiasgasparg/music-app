import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sandbox.academiadevelopers.com/harmonyhub',
});

export const login = async (username, password) => {
  try {
    const response = await axios.post('https://sandbox.academiadevelopers.com/api-auth/', {
      username,
      password,
    });
    return response.data.token;
  } catch (error) {
    console.error('Error during login:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem('Token');
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('https://sandbox.academiadevelopers.com/users/profiles/profile_data/');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateProfile = async (id, formData) => {
  try {
    const response = await api.put(`https://sandbox.academiadevelopers.com/users/profiles/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchSongById = async (id) => {
  try {
    const response = await api.get(`/songs/${id}/`);
    const song = response.data;
    console.log('Fetched song:', song);
    return song;
  } catch (error) {
    console.error('Error fetching song by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const updateProfileImage = async (url, formData) => {
  try {
    const response = await axios.patch(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${localStorage.getItem('Token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile image:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createArtist = async (formData) => {
  try {
    const response = await api.post('/artists/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating artist:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para agregar un álbum
export const addAlbum = async (formData) => {
  try {
    const response = await api.post('/albums/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding album:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener álbumes con paginación
export const fetchAlbums = async (page) => {
  try {
    const response = await api.get(`/albums/?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching albums:', error.response ? error.response.data : error.message);
    throw error;
  }
};
export const uploadSong = async (formData) => {
  try {
    const response = await api.post('/songs/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading song:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener el perfil del usuario
export const fetchUserProfile = async () => {
  try {
    const data = await getProfile();
    return {
      user__id: data.user__id,
      username: data.username,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      image: data.image,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Función para actualizar el perfil del usuario
export const submitUserProfileUpdate = async (userId, profile, originalProfile) => {
  try {
    const formData = new FormData();
    formData.append('username', profile.username || originalProfile.username);
    formData.append('email', profile.email || originalProfile.email);
    formData.append('first_name', profile.first_name || originalProfile.first_name);
    formData.append('last_name', profile.last_name || originalProfile.last_name);

    await updateProfile(userId, formData);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Función para actualizar la imagen de perfil del usuario
export const submitProfileImageUpdate = async (userId, image) => {
  try {
    const formData = new FormData();
    formData.append('image', image);
    const response = await updateProfileImage(`https://sandbox.academiadevelopers.com/users/profiles/${userId}/`, formData);
    return response;
  } catch (error) {
    console.error('Error updating profile image:', error);
    throw error;
  }
};

export default api;
