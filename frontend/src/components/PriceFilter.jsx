// Price Filter Component
import React, { useState, useEffect } from 'react';

const PriceFilter = ({ onPriceChange, minPrice: initialMinPrice = 0, maxPrice: initialMaxPrice = 1000 }) => {
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);

  useEffect(() => {
    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);
    setPriceRange([initialMinPrice, initialMaxPrice]);
  }, [initialMinPrice, initialMaxPrice]);

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setMinPrice(value);
    if (value <= maxPrice) {
      setPriceRange([value, maxPrice]);
      onPriceChange(value, maxPrice);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setMaxPrice(value);
    if (value >= minPrice) {
      setPriceRange([minPrice, value]);
      onPriceChange(minPrice, value);
    }
  };

  const handleRangeChange = (e, type) => {
    const value = parseInt(e.target.value) || 0;
    if (type === 'min') {
      if (value <= maxPrice) {
        setMinPrice(value);
        setPriceRange([value, maxPrice]);
        onPriceChange(value, maxPrice);
      }
    } else {
      if (value >= minPrice) {
        setMaxPrice(value);
        setPriceRange([minPrice, value]);
        onPriceChange(minPrice, value);
      }
    }
  };

  const clearFilters = () => {
    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);
    setPriceRange([initialMinPrice, initialMaxPrice]);
    onPriceChange(initialMinPrice, initialMaxPrice);
  };

  const presetRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: 10000 },
  ];

  const applyPresetRange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPriceRange([min, max]);
    onPriceChange(min, max);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Price Range</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Clear All
        </button>
      </div>

      {/* Preset Range Buttons */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Quick Select:</p>
        <div className="flex flex-wrap gap-2">
          {presetRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => applyPresetRange(range.min, range.max)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                minPrice === range.min && maxPrice === range.max
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>${minPrice}</span>
          <span>${maxPrice}</span>
        </div>
        
        <div className="relative mb-4">
          <input
            type="range"
            min="0"
            max="1000"
            value={minPrice}
            onChange={(e) => handleRangeChange(e, 'min')}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{ zIndex: 1 }}
          />
          <input
            type="range"
            min="0"
            max="1000"
            value={maxPrice}
            onChange={(e) => handleRangeChange(e, 'max')}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{ zIndex: 2 }}
          />
          <div
            className="absolute h-2 bg-blue-600 rounded-lg"
            style={{
              left: `${(minPrice / 1000) * 100}%`,
              width: `${((maxPrice - minPrice) / 1000) * 100}%`,
              zIndex: 0,
            }}
          />
        </div>
      </div>

      {/* Manual Price Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            min="0"
            max="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Min"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            min="0"
            max="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Current Range Display */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          Showing products priced between <strong>${minPrice}</strong> and <strong>${maxPrice}</strong>
        </p>
      </div>
    </div>
  );
};

export default PriceFilter;