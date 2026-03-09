const fs = require('fs');
const path = require('path');

const srcDir = 'e:/WEBS & APPS/educart/frontend/src';

const walk = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Fix any previous replacements that were incomplete
            // If it starts with /orders or /users after fetch( but not /api/
            content = content.replace(/fetch\(['"]\/orders/g, "fetch('/api/orders");
            content = content.replace(/fetch\(['"]\/users/g, "fetch('/api/users");
            content = content.replace(/fetch\(['"]\/products/g, "fetch('/api/products");
            content = content.replace(/fetch\(['"]\/reviews/g, "fetch('/api/reviews");
            content = content.replace(/fetch\(['"]\/newsletter/g, "fetch('/api/newsletter");

            // Handle template literals too
            content = content.replace(/fetch\(`\/orders/g, "fetch(`/api/orders");
            content = content.replace(/fetch\(`\/users/g, "fetch(`/api/users");
            content = content.replace(/fetch\(`\/products/g, "fetch(`/api/products");
            content = content.replace(/fetch\(`\/reviews/g, "fetch(`/api/reviews");
            content = content.replace(/fetch\(`\/newsletter/g, "fetch(`/api/newsletter");

            fs.writeFileSync(fullPath, content);
        }
    });
};

walk(srcDir);
console.log('All frontend API calls have been updated to use /api prefix.');
