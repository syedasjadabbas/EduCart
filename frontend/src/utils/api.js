export const getApiUrl = (path) => {
    // Detect environment
    const isProduction = typeof window !== 'undefined' && 
                         window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1' &&
                         window.location.hostname !== '';

    // Base URL Priority:
    // 1. Hardcoded production URL if on production hostname
    // 2. VITE_API_URL env var if set
    // 3. Localhost fallback
    let baseUrl = '';
    if (isProduction) {
        baseUrl = 'https://educart-backend-ucw2.onrender.com';
    } else {
        baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    }

    // SANITIZATION:
    // 1. Remove trailing slashes from base
    const cleanBase = baseUrl.trim().replace(/\/+$/, '');
    
    // 2. Extract the actual route part (everything after /api/ if it exists)
    let routePart = path.trim().replace(/^\/+/, ''); // Remove leading slashes
    if (routePart.startsWith('api/')) {
        routePart = routePart.substring(4);
    }

    // 3. Reconstruct: base + /api/ + cleaned route
    const finalUrl = cleanBase ? `${cleanBase}/api/${routePart}` : `/api/${routePart}`;
    
    // Debug log for production visibility
    if (isProduction) {
        console.log(`[API CALL] routing to: ${finalUrl}`);
    }
    
    return finalUrl;
};

export const fetchApi = async (path, options = {}) => {
    const url = getApiUrl(path);
    return fetch(url, options);
};
