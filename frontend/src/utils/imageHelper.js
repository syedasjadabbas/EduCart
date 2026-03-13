export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    
    // In Vite, environment variables are accessible via import.meta.env
    // We prioritize VITE_API_URL, then detect production hostname to use hardcoded backend
    let baseUrl = import.meta.env.VITE_API_URL || '';
    
    if (!baseUrl) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            baseUrl = 'http://localhost:5000';
        } else {
            // Hardcoded fallback for production environment (e.g. Vercel)
            baseUrl = 'https://educart-backend-ucw2.onrender.com';
        }
    }
    
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
};
