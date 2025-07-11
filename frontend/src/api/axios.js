import axios from 'axios';

// Create an instance of axios with base URL
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',  // Replace with your backend API URL
});

// Intercept requests to include the JWT token if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn('Unauthorized. Possibly invalid/expired token.');
        // Optional: trigger logout or token refresh logic here
      }
      return Promise.reject(error);
    }
  );
  

export default instance;
