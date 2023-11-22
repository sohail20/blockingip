import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

function logRequest(config) {
  axios.post('/api/log', { level: 'info', ...config })
    .then(response => {
      console.log('Request logged:', response.data);
    })
    .catch(error => {
      console.error('Error logging request:', error);
    });
}

axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("config", config.url)
    logRequest(config);
    return config;
  },
  (error) => {
    // postError(error);
    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Custom response handling can be added here if needed
//     return response;
//   },
//   (error) => {
//     // Custom error handling can be added here if needed
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
