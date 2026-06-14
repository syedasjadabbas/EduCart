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
 
let fetchCache = {};

export const fetchApi = async (path, options = {}) => {
    const url = getApiUrl(path);

    const isGet = !options.method || options.method.toUpperCase() === 'GET';
    const hasAuth = options.headers && (options.headers['Authorization'] || options.headers['authorization']);

    // Cache public GET requests for 30 seconds, skip orders and admin verifications
    if (isGet && !hasAuth && !path.includes('/api/orders') && !path.includes('/api/users/pending-verifications')) {
        const cached = fetchCache[url];
        if (cached && (Date.now() - cached.timestamp < 30000)) {
            console.log(`[CACHE HIT] ${url}`);
            return cached.response.clone();
        }

        const res = await fetch(url, options);
        if (res.ok) {
            fetchCache[url] = {
                response: res.clone(),
                timestamp: Date.now()
            };
        }
        return res;
    }

    // Clear cache on mutations (POST, PUT, DELETE)
    if (!isGet) {
        console.log(`[CACHE CLEAR] due to mutation on ${url}`);
        fetchCache = {};
    }

    return fetch(url, options);
};
