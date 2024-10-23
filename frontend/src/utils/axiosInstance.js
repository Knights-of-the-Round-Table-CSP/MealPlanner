import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/', // replace with your API URL
});

// Function to retrieve the token
const getToken = () => {
    // Retrieving from local storage
    return localStorage.getItem('access_token');
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle the error
        return Promise.reject(error);
    }
);

export default axiosInstance;