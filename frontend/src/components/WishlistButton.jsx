// Wishlist Button Component
import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const WishlistButton = ({ product, size = 'md', showLabel = false }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const handleWishlistClick = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (!user) {
      alert('Please login to add items to your wishlist');
      return;
    }

    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Error updating wishlist. Please try again.');
    }
  };

  const inWishlist = isInWishlist(product.id);

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2.5 text-sm',
    lg: 'p-3.5 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleWishlistClick}
      className={`
        ${sizeClasses[size]}
        ${inWishlist
          ? 'text-pink-500 hover:text-pink-600 bg-pink-50 border border-pink-200'
          : 'text-gray-500 hover:text-pink-500 bg-white border border-gray-200'}
        rounded-full shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-40
        ${showLabel ? 'flex items-center space-x-2' : ''}
      `}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className={iconSizes[size]}
        fill={inWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {showLabel && (
        <span className="text-sm font-medium">
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;