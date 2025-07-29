import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw, Phone, Wifi, Bluetooth, Zap } from 'lucide-react';
import { getProductById } from '../data/mockProducts';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types/Product';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { dispatch } = useCart();

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      setProduct(foundProduct || null);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#000033] mb-4">Product not found</h2>
          <Link to="/products" className="text-[#00BFFF] hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
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
    }
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
      'DE': '🇩🇪',
      'UK': '🇬🇧'
    };
    return flags[country] || '🌍';
  };

  // Mock additional images for demonstration
  const productImages = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-[#00BFFF] transition-colors duration-200">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#00BFFF] transition-colors duration-200">Products</Link>
          <span>/</span>
          <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-[#00BFFF] transition-colors duration-200">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#000033] font-medium">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link 
          to="/products" 
          className="inline-flex items-center text-[#00BFFF] hover:text-[#0099CC] mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
              <img
                src={productImages[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badges && product.badges.map((badge, index) => (
                <div
                  key={index}
                  className={`absolute top-4 left-4 px-3 py-1 text-sm font-medium rounded-full ${
                    badge === 'New' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {badge}
                </div>
              ))}
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                    activeImageIndex === index ? 'border-[#00BFFF]' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* YouTube Guide */}
            {product.youtubeGuide && (
              <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
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
            {/* Title and Rating */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-[#000033]">{product.name}</h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#00BFFF] hover:bg-gray-50 rounded-full transition-colors duration-200">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-lg font-medium ml-2">{product.rating || '4.5'}</span>
                  <span className="text-gray-500">(128 reviews)</span>
                </div>
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full flex items-center">
                  {getCountryFlag(product.countryOfOrigin)} Made in {product.countryOfOrigin}
                </span>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price and Stock */}
            <div className="border-y border-gray-200 py-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-4xl font-bold text-[#000033]">₹{product.price}</span>
                  <span className="text-gray-500 ml-2">GST included</span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                  <p className="text-sm text-gray-500">Free shipping on orders above ₹500</p>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-[#000033] transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-[#000033] transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center space-x-2 bg-[#00BFFF] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#0099CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Key Specifications */}
            {product.keySpecs && (
              <div>
                <h3 className="text-xl font-semibold text-[#000033] mb-4">Key Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.keySpecs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{key}:</span>
                      <span className="text-[#000033] font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Protocols */}
            {product.protocols && product.protocols.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-[#000033] mb-4">Supported Protocols</h3>
                <div className="flex flex-wrap gap-2">
                  {product.protocols.map((protocol, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-2 bg-[#00BFFF]/10 text-[#00BFFF] px-3 py-2 rounded-full"
                    >
                      {getProtocolIcon(protocol)}
                      <span>{protocol}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Compatibility */}
            {product.compatibility && (
              <div>
                <h3 className="text-xl font-semibold text-[#000033] mb-4">Compatibility</h3>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map((item, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Service Features */}
            <div>
              <h3 className="text-xl font-semibold text-[#000033] mb-4">What You Get</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-[#00BFFF]" />
                  <span className="text-gray-700">Free shipping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-[#00BFFF]" />
                  <span className="text-gray-700">1 year warranty</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-5 h-5 text-[#00BFFF]" />
                  <span className="text-gray-700">Easy returns</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#00BFFF]" />
                  <span className="text-gray-700">Tech support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#000033] mb-8">Related Products</h2>
          <div className="text-center py-8 text-gray-500">
            Related products will be displayed here based on category and tags.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;