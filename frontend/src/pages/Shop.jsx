import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useState, useMemo, useEffect } from 'react';
import { Filter, Search, Loader, SearchX } from 'lucide-react';
import { ProductSkeleton, EmptyState } from '../components/Skeletons';
import { fetchApi } from '../utils/api';

const Shop = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'all';
    const initialSearch = queryParams.get('search') || '';

    const [category, setCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Artificial delay to show off beautiful skeletons for 600ms
                await new Promise(r => setTimeout(r, 600));

                const res = await fetchApi('/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search') || '';
        const categoryParam = params.get('category') || 'all';

        setSearchQuery(searchParam);
        setCategory(categoryParam);
    }, [location.search]);

    const categories = [
        { id: 'all', name: 'All Products' },
        { id: 'stationery', name: 'Stationery' },
        { id: 'gadgets', name: 'Study Gadgets' },
        { id: 'laptop', name: 'Laptop Accs' },
        { id: 'backpacks', name: 'Backpacks' },
        { id: 'desk', name: 'Desk Accs' },
        { id: 'bottles', name: 'Water Bottles' },
    ];

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchCategory = category === 'all' || product.category === category;
            const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [category, searchQuery, products]);

    return (
        <div className="bg-[var(--color-background)] min-h-screen py-10 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Shop Essentials</h1>
                        <p className="text-[var(--color-text-muted)]">Find the best products for your study needs.</p>
                    </div>

                    <div className="flex w-full md:w-auto gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[var(--color-surface)] rounded-xl py-2 pl-10 pr-4 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-[var(--color-text-main)]"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-64 shrink-0">
                        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Categories
                            </h2>
                            <ul className="space-y-2">
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => setCategory(cat.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${category === cat.id
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                                : 'text-[var(--color-text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <EmptyState
                                icon={SearchX}
                                title="No products found"
                                description={`We couldn't find anything matching "${searchQuery}". Try adjusting your filters or search query.`}
                                action={
                                    <button
                                        onClick={() => { setSearchQuery(''); setCategory('all'); }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors mt-2"
                                    >
                                        Clear all filters
                                    </button>
                                }
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Shop;
