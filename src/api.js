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

export default api;
