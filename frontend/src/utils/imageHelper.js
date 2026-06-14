export const getImageUrl = (path, options = {}) => {
    if (!path) return '';
    let finalPath = path;

    if (!path.startsWith('http://') && !path.startsWith('https://')) {
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
        finalPath = `${cleanBase}/${cleanPath}`;
    }

    // Cloudinary optimization on-the-fly
    if (finalPath.includes('res.cloudinary.com')) {
        const width = options.width ? `,w_${options.width}` : '';
        const height = options.height ? `,h_${options.height}` : '';
        const crop = options.crop ? `,c_${options.crop}` : '';
        // Inject format auto, quality auto, device pixel ratio auto, and sizing properties
        finalPath = finalPath.replace('/upload/', `/upload/f_auto,q_auto,dpr_auto${width}${height}${crop}/`);
    }

    return finalPath;
};
