import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ShoppingCart, Eye, Star, Wifi, Bluetooth, Zap } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import QuickViewModal from './QuickViewModal';
import { Product } from '../../types/Product';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock
      }
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'IN': '🇮🇳',
      'CN': '🇨🇳',
      'JP': '🇯🇵',
      'US': '🇺🇸',
      'DE': '🇩🇪'
    };
    return flags[country] || '🌍';
  };

  const getProtocolIcon = (protocol: string) => {
    switch (protocol.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'bluetooth':
        return <Bluetooth className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  if (viewMode === 'list') {
    return (
      <>
        <div 
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-[#00BFFF]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="md:w-48 flex-shrink-0">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {product.badges && product.badges.map((badge, index) => (
                  <span
                    key={index}
                    className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full ${
                      badge === 'New' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <Link to={`/product/${product.id}`} className="group">
                  <h3 className="text-lg font-semibold text-[#000033] group-hover:text-[#00BFFF] transition-colors duration-200 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center">
                  {getCountryFlag(product.countryOfOrigin)} {product.countryOfOrigin}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

              {/* Protocols */}
              {product.protocols && product.protocols.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-500">Protocols:</span>
                  <div className="flex items-center gap-1">
                    {product.protocols.slice(0, 3).map((protocol, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 bg-[#00BFFF]/10 text-[#00BFFF] px-2 py-1 rounded-full text-xs"
                      >
                        {getProtocolIcon(protocol)}
                        {protocol}
                      </span>
                    ))}
                    {product.protocols.length > 3 && (
                      <span className="text-xs text-gray-400">+{product.protocols.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#000033]">₹{product.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating || '4.5'}</span>
                  </div>
                  <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleQuickView}
                    className="p-2 text-gray-600 hover:text-[#00BFFF] hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    title="Quick view"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex items-center gap-2 bg-[#00BFFF] text-white px-4 py-2 rounded-lg hover:bg-[#0099CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isQuickViewOpen && createPortal(
          <QuickViewModal
            product={product}
            isOpen={isQuickViewOpen}
            onClose={() => setIsQuickViewOpen(false)}
          />,
          document.body
        )}
      </>
    );
  }

  return (
    <>
      <div
        className="h-full flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#00BFFF] group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
          <Link to={`/product/${product.id}`} className="absolute inset-0 flex items-center justify-center p-4">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
            />
          </Link>
          
          {/* Badges */}
          {product.badges && product.badges.map((badge, index) => (
            <span
              key={index}
              className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full ${
                badge === 'New' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {badge}
            </span>
          ))}

          {/* Country Flag */}
          <span className="absolute top-2 right-2 text-xs bg-white/90 px-2 py-1 rounded-full">
            {getCountryFlag(product.countryOfOrigin)} {product.countryOfOrigin}
          </span>

          {/* Hover Actions */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={handleQuickView}
              className="bg-white text-[#000033] p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Quick view"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-[#00BFFF] text-white p-2 rounded-full hover:bg-[#0099CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col h-full">
          <Link to={`/product/${product.id}`} className="group">
            <h3 className="font-semibold text-[#000033] group-hover:text-[#00BFFF] transition-colors duration-200 line-clamp-2 mb-2 min-h-[3rem]">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">{product.description}</p>

          {/* Protocols */}
          {product.protocols && product.protocols.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3 min-h-[2rem]">
              {product.protocols.slice(0, 2).map((protocol, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 bg-[#00BFFF]/10 text-[#00BFFF] px-2 py-1 rounded-full text-xs"
                >
                  {getProtocolIcon(protocol)}
                  {protocol}
                </span>
              ))}
              {product.protocols.length > 2 && (
                <span className="text-xs text-gray-400 px-2 py-1">+{product.protocols.length - 2}</span>
              )}
            </div>
          )}
          
          {/* Spacer to push bottom content down */}
          <div className="flex-grow"></div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-[#000033]">₹{product.price}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating || '4.5'}</span>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between mt-auto">
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="text-sm bg-[#00BFFF] text-white px-3 py-1 rounded hover:bg-[#0099CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {isQuickViewOpen && createPortal(
        <QuickViewModal
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />,
        document.body
      )}
    </>
  );
};

export default ProductCard;