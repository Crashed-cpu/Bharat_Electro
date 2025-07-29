import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import { mockProducts } from '../data/mockProducts';
import { Filter, Grid, List } from 'lucide-react';

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: category || '',
    protocol: '',
    useCase: '',
    priceRange: [0, 10000],
    inStock: false,
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    let filtered = mockProducts;

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Apply protocol filter
    if (filters.protocol) {
      filtered = filtered.filter(product => 
        product.protocols?.includes(filters.protocol)
      );
    }

    // Apply use case filter
    if (filters.useCase) {
      filtered = filtered.filter(product => 
        product.useCases?.includes(filters.useCase)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredProducts(filtered);
  }, [filters, category]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#000033] mb-2">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
            </h1>
            <p className="text-gray-600">
              {filteredProducts.length} products found
            </p>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#00BFFF] transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#00BFFF] text-white' : 'text-gray-600 hover:text-[#000033]'} transition-colors duration-200`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#00BFFF] text-white' : 'text-gray-600 hover:text-[#000033]'} transition-colors duration-200`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <ProductFilter
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} viewMode={viewMode} />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;