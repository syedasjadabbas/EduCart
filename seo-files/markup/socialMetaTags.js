/**
 * Open Graph & Social Media Meta Tag Generator
 */

const generateOpenGraphTags = (product) => {
    return {
        'og:title': product.seoTitle || product.name,
        'og:description': product.seoDescription || product.description?.substring(0, 150),
        'og:type': 'product',
        'og:url': `${process.env.FRONTEND_URL || 'http://localhost:5173'}/product/${product._id}`,
        'og:image': product.image,
        'og:image:width': '600',
        'og:image:height': '600',
        'og:site_name': 'EduCart - Student Essentials'
    };
};

const generateTwitterCardTags = (product) => {
    return {
        'twitter:card': 'summary_large_image',
        'twitter:title': product.seoTitle || product.name,
        'twitter:description': product.seoDescription || product.description?.substring(0, 150),
        'twitter:image': product.image,
        'twitter:creator': '@educart'
    };
};

const generateFacebookMetaTags = (product) => {
    return {
        'fb:app_id': process.env.FACEBOOK_APP_ID || '',
        'og:price:amount': product.price,
        'og:price:currency': 'PKR',
        'og:availability': product.stock > 0 ? 'in stock' : 'out of stock'
    };
};

module.exports = {
    generateOpenGraphTags,
    generateTwitterCardTags,
    generateFacebookMetaTags
};
