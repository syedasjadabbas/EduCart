import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit, Trash2, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { getImageUrl } from '../utils/imageHelper';


const ProductManager = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: '', stock: '', oldPrice: '', discount: '', seoTitle: '', seoDescription: '', seoKeywords: '', slug: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
                toast.success('Product deleted successfully!');
            } else {
                toast.error("Failed to delete product");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleEditClick = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            oldPrice: product.oldPrice || '',
            discount: product.discount || '',
            seoTitle: product.seoTitle || '',
            seoDescription: product.seoDescription || '',
            seoKeywords: product.seoKeywords ? product.seoKeywords.join(', ') : '',
            slug: product.slug || ''
        });
        setImageFile(null);
        setIsEditing(true);
    };

    const handleAddClick = () => {
        setCurrentProduct(null);
        setFormData({
            name: '', description: '', price: '', category: 'stationery', stock: '', oldPrice: '', discount: '', seoTitle: '', seoDescription: '', seoKeywords: '', slug: ''
        });
        setImageFile(null);
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        if (formData.oldPrice) data.append('oldPrice', formData.oldPrice);
        if (formData.discount) data.append('discount', formData.discount);
        if (formData.seoTitle) data.append('seoTitle', formData.seoTitle);
        if (formData.seoDescription) data.append('seoDescription', formData.seoDescription);
        if (formData.seoKeywords) data.append('seoKeywords', formData.seoKeywords);
        if (formData.slug) data.append('slug', formData.slug);
        if (imageFile) data.append('image', imageFile);

        try {
            const url = currentProduct
                ? `/api/products/${currentProduct._id}`
                : `/api/products`;
            const method = currentProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                body: data
            });

            if (res.ok) {
                await fetchProducts();
                toast.success('Product saved successfully!');
                setIsEditing(false);
            } else {
                const err = await res.json();
                toast.error(`Error: ${err.message} `);
            }
        } catch (e) {
            console.error(e);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[var(--color-text-main)]">Manage Products</h2>
                <button onClick={handleAddClick} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-colors">
                    <Plus className="w-5 h-5" /> Add Product
                </button>
            </div>

            {loading && !isEditing ? (
                <div className="text-center py-12 text-[var(--color-text-muted)]">Loading products...</div>
            ) : (
                <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Image</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Stock</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {products.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={getImageUrl(p.image)} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                                    </td >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-main)] w-full max-w-xs truncate overflow-hidden">
                                        {p.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-main)] font-semibold">
                                        {formatCurrency(p.price)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {p.stock <= 5 ? (
                                            <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                                <AlertCircle className="w-3 h-3" /> LOW STOCK ({p.stock})
                                            </span>
                                        ) : (
                                            <span className="text-[var(--color-text-muted)]">{p.stock} units</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => handleEditClick(p)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1 font-bold">
                                                <Edit className="w-4 h-4" /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1 font-bold">
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr >
                            ))}
                        </tbody >
                    </table >
                </div >
            )}

            {
                isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
                        <div className="bg-[var(--color-surface)] w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 my-8 flex flex-col">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-bold text-[var(--color-text-main)]">{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Product Name</label>
                                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[var(--color-text-main)]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Description</label>
                                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows="3" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[var(--color-text-main)] resize-none"></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Price</label>
                                            <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-[var(--color-text-main)]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Stock</label>
                                            <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-[var(--color-text-main)]" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Old Price (Optional)</label>
                                            <input type="number" value={formData.oldPrice} onChange={e => setFormData({ ...formData, oldPrice: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-[var(--color-text-main)]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Discount % (Optional)</label>
                                            <input type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-[var(--color-text-main)]" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Category</label>
                                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-[var(--color-text-main)]">
                                            <option value="stationery">Stationery</option>
                                            <option value="gadgets">Study Gadgets</option>
                                            <option value="laptop">Laptop Accessories</option>
                                            <option value="backpacks">Backpacks</option>
                                            <option value="desk">Desk Accessories</option>
                                            <option value="bottles">Water Bottles</option>
                                        </select>
                                    </div>
                                    <div>
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
                                        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Product Image {currentProduct && '(Leave blank to keep current)'}</label>
                                        <input type="file" onChange={e => setImageFile(e.target.files[0])} accept="image/*" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                    </div>
                                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                                        <button type="submit" disabled={loading} className="px-5 py-2.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors disabled:opacity-50">
                                            {loading ? 'Saving...' : 'Save Product'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ProductManager;
