import React from 'react';
import { X, ShoppingCart, Star, Wifi, Bluetooth, Zap } from 'lucide-react';
import { Product } from '../../types/Product';
import { useCart } from '../../contexts/CartContext';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { dispatch } = useCart();

  if (!isOpen) return null;

  const handleAddToCart = () => {
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
    onClose();
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

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-xl rounded-2xl p-6 transform transition-all animate-modal-enter">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10 bg-white rounded-full shadow-md"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
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
                <span className="absolute top-2 right-2 text-xs bg-white/90 px-2 py-1 rounded-full">
                  {getCountryFlag(product.countryOfOrigin)} {product.countryOfOrigin}
                </span>
              </div>

              {/* YouTube Guide */}
              {product.youtubeGuide && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${product.youtubeGuide}`}
                    title="Product Guide"
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#000033] mb-2">{product.name}</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-medium">{product.rating || '4.5'}</span>
                    <span className="text-gray-500">(128 reviews)</span>
                  </div>
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Key Specifications */}
              {product.keySpecs && (
                <div>
                  <h3 className="text-lg font-semibold text-[#000033] mb-3">Key Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(product.keySpecs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">{key}:</span>
                        <span className="text-[#000033] text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Protocols */}
              {product.protocols && product.protocols.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#000033] mb-3">Supported Protocols</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.protocols.map((protocol, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 bg-[#00BFFF]/10 text-[#00BFFF] px-3 py-2 rounded-full text-sm"
                      >
                        {getProtocolIcon(protocol)}
                        {protocol}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Compatibility */}
              {product.compatibility && (
                <div>
                  <h3 className="text-lg font-semibold text-[#000033] mb-3">Compatibility</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.compatibility.map((item, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price and Actions */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-[#000033]">₹{product.price}</span>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Free shipping on orders above ₹500</p>
                    <p className="text-sm text-gray-500">GST included</p>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full flex items-center justify-center gap-3 bg-[#00BFFF] text-white py-4 rounded-lg font-semibold hover:bg-[#0099CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default QuickViewModal;