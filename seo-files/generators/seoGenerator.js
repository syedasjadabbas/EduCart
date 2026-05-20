/**
 * SEO Generator Utility
 * Automatically generates professional SEO metadata for products
 * Location: seo-files/generators/seoGenerator.js
 */

const generateSEOTitle = (productName, category) => {
    if (!productName) return 'Product';
    
    // Trim title to max 60 chars (ideal for Google)
    const base = `${productName}${category ? ` - ${category}` : ''} | EduCart`;
    return base.length > 60 ? base.substring(0, 57) + '...' : base;
};

const generateSEODescription = (productName, description, category, price) => {
    if (!productName && !description) return 'Quality products available on EduCart - Student Essentials Store';
    
    let desc = '';
    
    if (productName && description) {
        // Use first 150 chars of description
        const shortDesc = description.substring(0, 120);
        desc = `${productName}: ${shortDesc}`;
    } else if (productName) {
        desc = `Buy ${productName} online${category ? ` in ${category}` : ''} on EduCart. `;
        if (price) desc += `Price: PKR ${price}. `;
        desc += 'Fast shipping, authentic products, student discounts available.';
    }
    
    // Ensure it's 120-160 chars (ideal for Google search results)
    if (desc.length > 160) {
        desc = desc.substring(0, 157) + '...';
    } else if (desc.length < 50) {
        if (category) {
            desc = `Buy ${productName} in ${category} online at EduCart. Student essentials store with fast shipping and competitive prices.`;
        } else {
            desc = `Buy ${productName} online at EduCart. Quality student essentials with fast shipping and authentic products.`;
        }
    }
    
    return desc;
};

const generateSEOKeywords = (productName, category, description) => {
    const keywords = new Set();
    
    // Add product name and variations
    if (productName) {
        keywords.add(productName.toLowerCase());
        keywords.add(`buy ${productName.toLowerCase()}`);
        keywords.add(`${productName.toLowerCase()} online`);
    }
    
    // Add category-related keywords
    if (category) {
        keywords.add(category.toLowerCase());
        keywords.add(`${category.toLowerCase()} store`);
        keywords.add(`${category.toLowerCase()} online`);
        
        // Add specific category keywords
        const categoryKeywords = {
            'laptops': ['gaming laptop', 'laptop computer', 'portable computer', 'notebook'],
            'headphones': ['wireless headphones', 'audio headphones', 'earphones', 'sound'],
            'phones': ['mobile phone', 'smartphone', 'android phone', 'ios phone'],
            'books': ['textbook', 'reference book', 'educational book', 'student book'],
            'stationery': ['notebook', 'pen', 'pencil', 'writing supplies', 'study material'],
            'bags': ['backpack', 'school bag', 'laptop bag', 'travel bag'],
            'accessories': ['tech accessories', 'gadgets', 'computer accessories'],
        };
        
        const lowerCategory = category.toLowerCase();
        if (categoryKeywords[lowerCategory]) {
            categoryKeywords[lowerCategory].forEach(kw => keywords.add(kw));
        }
    }
    
    // Extract important words from description
    if (description) {
        const words = description
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 3 && !['that', 'this', 'with', 'from', 'have', 'been', 'make', 'like', 'good', 'best', 'new', 'high', 'best', 'great', 'more'].includes(w))
            .slice(0, 5);
        
        words.forEach(w => keywords.add(w));
    }
    
    // Add location/store keywords
    keywords.add('pakistan');
    keywords.add('online store');
    keywords.add('educart');
    keywords.add('student');
    
    // Limit to 8-10 keywords
    const result = Array.from(keywords).slice(0, 10);
    return result;
};

/**
 * Generate complete SEO metadata for a product
 * @param {Object} product - Product object with name, category, description, price
 * @param {Object} options - Options for SEO generation
 * @returns {Object} - Object with seoTitle, seoDescription, seoKeywords
 */
const generateSEOMetadata = (product, options = {}) => {
    const {
        forceGenerate = false, // if true, regenerate even if SEO fields exist
        preserveExisting = true // if true, don't overwrite existing SEO data
    } = options;
    
    // Check if we should generate
    if (preserveExisting && product.seoTitle && product.seoDescription && product.seoKeywords?.length > 0) {
        if (!forceGenerate) {
            return {
                seoTitle: product.seoTitle,
                seoDescription: product.seoDescription,
                seoKeywords: product.seoKeywords
            };
        }
    }
    
    return {
        seoTitle: product.seoTitle || generateSEOTitle(product.name, product.category),
        seoDescription: product.seoDescription || generateSEODescription(product.name, product.description, product.category, product.price),
        seoKeywords: product.seoKeywords && product.seoKeywords.length > 0 
            ? product.seoKeywords 
            : generateSEOKeywords(product.name, product.category, product.description)
    };
};

module.exports = {
    generateSEOTitle,
    generateSEODescription,
    generateSEOKeywords,
    generateSEOMetadata
};
