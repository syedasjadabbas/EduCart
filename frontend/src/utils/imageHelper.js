export const getImageUrl = (path) => {
    if (!path) return '';
    // If it's already a full URL (like dicebear or placehold.co), return as is
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    
    // Construct dynamic backend URL using the current hostname
    return `http://${window.location.hostname}:5000${path.startsWith('/') ? '' : '/'}${path}`;
};
