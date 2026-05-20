/**
 * Database Migrations
 * Schema updates and data transformations
 */

module.exports = {
    description: 'This folder contains database migration scripts',
    migrations: [
        {
            name: 'Migration: Add SEO fields to Products',
            file: 'add-seo-fields.js',
            description: 'Adds seoTitle, seoDescription, seoKeywords fields to existing products'
        },
        {
            name: 'Migration: Initialize SEO metadata',
            file: 'init-seo-metadata.js',
            description: 'Generates SEO metadata for all products without SEO data'
        }
    ]
};
