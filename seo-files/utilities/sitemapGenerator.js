/**
 * Sitemap Generator for SEO
 * Generates XML sitemap for search engine crawling
 */

const generateProductSitemap = (products, baseUrl = 'https://educart.vercel.app') => {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add main pages
    const mainPages = [
        { loc: '/', changefreq: 'daily', priority: '1.0' },
        { loc: '/shop', changefreq: 'daily', priority: '0.9' },
        { loc: '/about', changefreq: 'weekly', priority: '0.7' },
        { loc: '/contact', changefreq: 'weekly', priority: '0.7' },
        { loc: '/privacy', changefreq: 'monthly', priority: '0.5' },
        { loc: '/terms', changefreq: 'monthly', priority: '0.5' }
    ];
    
    mainPages.forEach(page => {
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}${page.loc}</loc>\n`;
        sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
        sitemap += `    <priority>${page.priority}</priority>\n`;
        sitemap += `  </url>\n`;
    });
    
    // Add product pages
    if (products && Array.isArray(products)) {
        products.forEach(product => {
            sitemap += `  <url>\n`;
            sitemap += `    <loc>${baseUrl}/product/${product._id || product.id}</loc>\n`;
            sitemap += `    <lastmod>${new Date(product.updatedAt || product.createdAt).toISOString().split('T')[0]}</lastmod>\n`;
            sitemap += `    <changefreq>weekly</changefreq>\n`;
            sitemap += `    <priority>0.8</priority>\n`;
            sitemap += `  </url>\n`;
        });
    }
    
    sitemap += '</urlset>';
    return sitemap;
};

/**
 * Generate sitemap index for large sites
 */
const generateSitemapIndex = (sitemapUrls) => {
    let index = '<?xml version="1.0" encoding="UTF-8"?>\n';
    index += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    sitemapUrls.forEach(url => {
        index += `  <sitemap>\n`;
        index += `    <loc>${url}</loc>\n`;
        index += `  </sitemap>\n`;
    });
    
    index += '</sitemapindex>';
    return index;
};

module.exports = {
    generateProductSitemap,
    generateSitemapIndex
};
