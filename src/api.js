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

export const getProfile = async (id) => {
  try {
    const response = await api.get(`https://sandbox.academiadevelopers.com/users/profiles/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateProfile = async (id, profileData) => {
  try {
    const response = await api.put(`https://sandbox.academiadevelopers.com/users/profiles/${id}/`, profileData);
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
      config.headers.Authorization = `JWT ${token}`;
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
        Authorization: `JWT ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile image:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default api;
