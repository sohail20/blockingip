import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

function postError(err) {
  fetch('/api/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ level: 'error', message: err }),
  });
}

const logRequest = async (config) => {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ level: 'info', ...config }),
    });
  } catch (err) {
    postError(err);
    console.error('Error storing request:', err);
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    logRequest(config);
    return config;
  },
  (error) => {
    postError(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Custom response handling can be added here if needed
    return response;
  },
  (error) => {
    // Custom error handling can be added here if needed
    return Promise.reject(error);
  }
);

export default axiosInstance;
