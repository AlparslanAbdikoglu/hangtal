
import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';

export interface Product {
  id: number;
  name: string;
  description: string;
  short_description: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
}

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onAddToCart }) => {
  const currentPrice = product.sale_price || product.regular_price;
  const originalPrice = product.sale_price ? product.regular_price : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images.length > 0 ? (
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-primary">
                  €{parseFloat(currentPrice).toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    €{parseFloat(originalPrice).toFixed(2)}
                  </span>
                )}
              </div>
              
              {product.stock_quantity > 0 ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  In Stock ({product.stock_quantity} available)
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div 
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Attributes */}
            {product.attributes.length > 0 && (
              <div className="space-y-3">
                {product.attributes.map((attribute) => (
                  <div key={attribute.id}>
                    <h3 className="font-medium text-gray-900 mb-2">{attribute.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {attribute.options.map((option, index) => (
                        <Badge key={index} variant="outline">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={onAddToCart}
                disabled={product.stock_quantity <= 0}
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Full Description */}
            {product.description && (
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-3">Description</h3>
                <div 
                  className="text-gray-600 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
