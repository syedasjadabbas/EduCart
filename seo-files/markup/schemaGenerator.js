/**
 * Schema.org Markup Generator
 * Generates JSON-LD structured data for products
 */

const generateProductSchema = (product) => {
    return {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        'name': product.name,
        'description': product.description,
        'image': product.image,
        'brand': {
            '@type': 'Brand',
            'name': 'EduCart'
        },
        'offers': {
            '@type': 'Offer',
            'url': `${process.env.FRONTEND_URL || 'http://localhost:5173'}/product/${product._id}`,
            'priceCurrency': 'PKR',
            'price': product.price,
            'availability': product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        },
        'aggregateRating': product.ratings > 0 ? {
            '@type': 'AggregateRating',
            'ratingValue': product.ratings,
            'ratingCount': product.numReviews
        } : undefined
    };
};

const generateOrganizationSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'EduCart',
        'url': process.env.FRONTEND_URL || 'http://localhost:5173',
        'logo': `${process.env.FRONTEND_URL || 'http://localhost:5173'}/logo.png`,
        'description': 'EduCart - Student Essentials Store. Best online shopping platform for students in Pakistan.',
        'sameAs': [
            'https://facebook.com/educart',
            'https://twitter.com/educart',
            'https://instagram.com/educart'
        ],
        'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'Customer Service',
            'email': 'support@educart.pk'
        }
    };
};

const generateBreadcrumbSchema = (breadcrumbs) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': item.name,
            'item': item.url
        }))
    };
};

module.exports = {
    generateProductSchema,
    generateOrganizationSchema,
    generateBreadcrumbSchema
};
