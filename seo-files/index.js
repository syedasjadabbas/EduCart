/**
 * SEO Files - Index/Entry Point
 * Export all SEO-related utilities from this single point
 */

// SEO Generators
const { 
    generateSEOTitle,
    generateSEODescription,
    generateSEOKeywords,
    generateSEOMetadata 
} = require('./generators/seoGenerator');

// Schema.org Markup
const {
    generateProductSchema,
    generateOrganizationSchema,
    generateBreadcrumbSchema
} = require('./markup/schemaGenerator');

// Social Media Meta Tags
const {
    generateOpenGraphTags,
    generateTwitterCardTags,
    generateFacebookMetaTags
} = require('./markup/socialMetaTags');

// Sitemap Utilities
const {
    generateProductSitemap,
    generateSitemapIndex
} = require('./utilities/sitemapGenerator');

module.exports = {
    // SEO Generators
    generateSEOTitle,
    generateSEODescription,
    generateSEOKeywords,
    generateSEOMetadata,
    
    // Schema.org
    generateProductSchema,
    generateOrganizationSchema,
    generateBreadcrumbSchema,
    
    // Social Media
    generateOpenGraphTags,
    generateTwitterCardTags,
    generateFacebookMetaTags,
    
    // Sitemap
    generateProductSitemap,
    generateSitemapIndex
};
