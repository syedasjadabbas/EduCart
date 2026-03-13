export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    
    const isProduction = typeof window !== 'undefined' && 
                         window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1' &&
                         window.location.hostname !== '';

    let baseUrl = '';
    if (isProduction) {
        baseUrl = 'https://educart-backend-ucw2.onrender.com';
    } else {
        baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    }

    const cleanBase = baseUrl.trim().replace(/\/+$/, '');
    const cleanPath = path.trim().replace(/^\/+/, '');
    
    return `${cleanBase}/${cleanPath}`;
};
