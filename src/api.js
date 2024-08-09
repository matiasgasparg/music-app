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
    localStorage.removeItem('token');
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


export const fetchRandomSong = async () => {
  try {
    const response = await api.get('/songs/');
    const { results } = response.data;
    const randomIndex = Math.floor(Math.random() * results.length);
    console.log('Selected song:', results[randomIndex]); // Verifica la canción seleccionada
    return results[randomIndex];
  } catch (error) {
    console.error('Error fetching random song:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;  // Cambiado a "Token"
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
        Authorization: `Token ${localStorage.getItem('token')}`,  // Cambiado a "Token"
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile image:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default api;
