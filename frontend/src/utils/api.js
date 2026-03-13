export const getApiUrl = (path) => {
    // Priority:
    // 1. Explicit VITE_API_URL environment variable
    // 2. Hardcoded production backend (for Vercel deployment safety)
    // 3. Relative path (last resort)
    
    // Check if we are in production (on Vercel) or if the env var is set
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    
    const baseUrl = import.meta.env.VITE_API_URL || 
                   (isProduction ? 'https://educart-backend-ucw2.onrender.com' : '');
    
    // Ensure the path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${baseUrl}${cleanPath}`;
};

export const fetchApi = async (path, options = {}) => {
    const url = getApiUrl(path);
    return fetch(url, options);
};
