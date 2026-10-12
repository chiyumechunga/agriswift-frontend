import axios from 'axios';

const apiClient = axios.create({
    // In dev, Vite proxy handles this. In prod, this is same-origin.
    baseURL: '/api/v1',

    // MANDATORY: Tells the browser to send HttpOnly cookies (JSESSIONID)
    // and readable cookies (XSRF-TOKEN) with every request.
    withCredentials: true,

    // Explicitly configure Axios CSRF defaults to match Spring Security
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    headers: {
        'Accept': 'application/json',
    }
});

// Global Error Handler: Redirect to login on Session Expiry (401/403)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Prevent redirect loops if we are already on the login page
            if (!window.location.pathname.includes('/login')) {
                console.warn('Session expired or unauthorized. Redirecting to login.');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;