import React from 'react';
import { X } from 'lucide-react';

interface FilterProps {
  filters: {
    category: string;
    protocol: string;
    useCase: string;
    priceRange: [number, number];
    inStock: boolean;
    search: string;
  };
  onFilterChange: (filters: any) => void;
}

const ProductFilter: React.FC<FilterProps> = ({ filters, onFilterChange }) => {
  const categories = [
    'Microcontrollers',
    'Sensors',
    'Tools',
    'Components',
    'Displays',
    'Power',
    'Connectivity'
  ];

  const protocols = [
    'I2C',
    'SPI',
    'UART',
    'WiFi',
    'Bluetooth',
    'LoRa',
    'GSM',
    'USB'
  ];

  const useCases = [
    'IoT',
    'Robotics',
    'Smart Home',
    'Repair',
    'Education',
    'Prototyping',
    'Industrial'
  ];

  const handleClearFilters = () => {
    onFilterChange({
      category: '',
      protocol: '',
      useCase: '',
      priceRange: [0, 10000],
      inStock: false,
      search: ''
    });
  };

  const hasActiveFilters = filters.category || filters.protocol || filters.useCase || 
                          filters.inStock || filters.search || 
                          filters.priceRange[0] > 0 || filters.priceRange[1] < 10000;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#000033]">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-600 hover:text-[#00BFFF] flex items-center gap-1 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by name or description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none transition-all duration-200"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Communication Protocols */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Communication Protocol
          </label>
          <select
            value={filters.protocol}
            onChange={(e) => onFilterChange({ protocol: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none transition-all duration-200"
          >
            <option value="">All Protocols</option>
            {protocols.map((protocol) => (
              <option key={protocol} value={protocol}>
                {protocol}
              </option>
            ))}
          </select>
        </div>

        {/* Use Cases */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Use Case
          </label>
          <select
            value={filters.useCase}
            onChange={(e) => onFilterChange({ useCase: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none transition-all duration-200"
          >
            <option value="">All Use Cases</option>
            {useCases.map((useCase) => (
              <option key={useCase} value={useCase}>
                {useCase}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (₹)
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => onFilterChange({ 
                  priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]] 
                })}
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none transition-all duration-200"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => onFilterChange({ 
                  priceRange: [filters.priceRange[0], parseInt(e.target.value) || 10000] 
                })}
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) => onFilterChange({ 
                priceRange: [filters.priceRange[0], parseInt(e.target.value)] 
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Stock Filter */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => onFilterChange({ inStock: e.target.checked })}
              className="w-4 h-4 text-[#00BFFF] border-gray-300 rounded focus:ring-[#00BFFF] focus:ring-2"
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;