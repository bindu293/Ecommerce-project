// Advanced Filter Component
import React, { useState } from 'react';
import PriceFilter from './PriceFilter';

const AdvancedFilters = ({ onFiltersChange, categories = [] }) => {
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    sortBy: 'newest',
    inStock: false,
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (minPrice, maxPrice) => {
    const newFilters = { ...filters, minPrice, maxPrice };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      category: 'all',
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      sortBy: 'newest',
      inStock: false,
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 4, label: '4★ & above' },
    { value: 3, label: '3★ & above' },
    { value: 2, label: '2★ & above' },
    { value: 1, label: '1★ & above' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name A-Z' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button
          onClick={clearAllFilters}
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          Clear All Filters
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="all"
              checked={filters.category === 'all'}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="mr-2 text-blue-600"
            />
            <span className="text-gray-700">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="mr-2 text-blue-600"
              />
              <span className="text-gray-700 capitalize">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onPriceChange={handlePriceChange}
        />
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Minimum Rating</h3>
        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ratingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Filter */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
            className="mr-2 text-blue-600"
          />
          <span className="text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Display */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Active Filters:</h4>
        <div className="flex flex-wrap gap-2">
          {filters.category !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Category: {filters.category}
              <button
                onClick={() => handleFilterChange('category', 'all')}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              Price: ${filters.minPrice} - ${filters.maxPrice}
              <button
                onClick={() => handlePriceChange(0, 1000)}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.rating > 0 && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Rating: {filters.rating}★ & above
              <button
                onClick={() => handleFilterChange('rating', 0)}
                className="ml-1 text-yellow-600 hover:text-yellow-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.inStock && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
              In Stock Only
              <button
                onClick={() => handleFilterChange('inStock', false)}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;