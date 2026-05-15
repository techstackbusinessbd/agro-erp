import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Necessary for Sanctum CSRF cookies
    withXSRFToken: true,   // Force Axios to send XSRF token for cross-origin local requests
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

export default apiClient;
