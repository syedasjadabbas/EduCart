const fs = require('fs');

let content = fs.readFileSync('src/components/ProductManager.jsx', 'utf-8');

// Update state
content = content.replace(
    "name: '', description: '', price: '', category: '', stock: '', oldPrice: '', discount: ''",
    "name: '', description: '', price: '', category: '', stock: '', oldPrice: '', discount: '', seoTitle: '', seoDescription: '', seoKeywords: '', slug: ''"
);

// Update handleEditClick
content = content.replace(
    "discount: product.discount || ''",
    "discount: product.discount || '', seoTitle: product.seoTitle || '', seoDescription: product.seoDescription || '', seoKeywords: product.seoKeywords ? product.seoKeywords.join(', ') : '', slug: product.slug || ''"
);

// Update handleAddClick
content = content.replace(
    "name: '', description: '', price: '', category: 'stationery', stock: '', oldPrice: '', discount: ''",
    "name: '', description: '', price: '', category: 'stationery', stock: '', oldPrice: '', discount: '', seoTitle: '', seoDescription: '', seoKeywords: '', slug: ''"
);

// Update handleSubmit
content = content.replace(
    "if (imageFile) data.append('image', imageFile);",
    "if (formData.seoTitle) data.append('seoTitle', formData.seoTitle);\n        if (formData.seoDescription) data.append('seoDescription', formData.seoDescription);\n        if (formData.seoKeywords) data.append('seoKeywords', formData.seoKeywords);\n        if (formData.slug) data.append('slug', formData.slug);\n        if (imageFile) data.append('image', imageFile);"
);

// Update JSX Form
const jsxToAdd = `                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">SEO Title</label>
                                        <input type="text" value={formData.seoTitle} onChange={e => setFormData({ ...formData, seoTitle: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[var(--color-text-main)]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">SEO Description</label>
                                        <textarea value={formData.seoDescription} onChange={e => setFormData({ ...formData, seoDescription: e.target.value })} rows="2" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[var(--color-text-main)] resize-none"></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">SEO Keywords (comma separated)</label>
                                            <input type="text" value={formData.seoKeywords} onChange={e => setFormData({ ...formData, seoKeywords: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-[var(--color-text-main)]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Slug (SEO friendly URL)</label>
                                            <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-[var(--color-text-main)]" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Product Image {currentProduct && '(Leave blank to keep current)'}</label>`;

content = content.replace(
    "<label className=\"block text-sm font-medium text-[var(--color-text-main)] mb-1\">Product Image {currentProduct && '(Leave blank to keep current)'}</label>",
    jsxToAdd.replace("Product Image {currentProduct && '(Leave blank to keep current)'}</label>", "") + "Product Image {currentProduct && '(Leave blank to keep current)'}</label>"
);

fs.writeFileSync('src/components/ProductManager.jsx', content, 'utf-8');
console.log('Update Complete!');
