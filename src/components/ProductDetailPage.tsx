import React, { useState } from 'react';
import {
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { myStoreHook } from '../MyStoreContext'; // Adjust path accordingly

export interface ProductImage {
  id: number;
  src: string;
  alt?: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
}

export interface Product {
  id: number | string;
  name: string;
  description?: string;
  short_description?: string;
  regular_price: string;
  sale_price?: string | null;
  stock_quantity?: number | null;
  images: ProductImage[];
  attributes: ProductAttribute[];
}

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = myStoreHook();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');
  const [showImageZoom, setShowImageZoom] = useState(false);

  const handleVariantSelect = (attributeName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [attributeName]: option,
    }));
  };

  const discountPercentage =
    product.sale_price && product.regular_price
      ? Math.round(
          ((parseFloat(product.regular_price) - parseFloat(product.sale_price)) /
            parseFloat(product.regular_price)) *
            100
        )
      : 0;

  const handleAddToCart = () => {
    addToCart({
      title: product.name,
      price: Number(product.sale_price || product.regular_price),
      image: product.images[0]?.src || '',
      product_id: product.id,
      quantity: 1,
      variants: selectedVariants,
    });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Images gallery */}
          <div className="md:w-1/2">
            <div className="relative">
              <img
                src={product.images[selectedImageIndex]?.src}
                alt={product.images[selectedImageIndex]?.alt || product.name}
                className="rounded-lg object-contain max-h-[500px] cursor-zoom-in"
                onClick={() => setShowImageZoom(true)}
              />
              {showImageZoom && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-zoom-out"
                  onClick={() => setShowImageZoom(false)}
                >
                  <img
                    src={product.images[selectedImageIndex]?.src}
                    alt={product.images[selectedImageIndex]?.alt || product.name}
                    className="max-h-full max-w-full"
                  />
                </div>
              )}
            </div>
            <div className="flex mt-4 space-x-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={img.id || idx}
                  src={img.src}
                  alt={img.alt || product.name}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                    idx === selectedImageIndex ? 'border-blue-600' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImageIndex(idx)}
                />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="md:w-1/2 flex flex-col">
            <h1 className="text-3xl font-semibold">{product.name}</h1>

            {/* Price and discount */}
            <div className="mt-4">
              {product.sale_price ? (
                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl font-bold text-red-600">
                    {t('products.detail.salePrice', { defaultValue: 'Sale Price' })}: €{product.sale_price}
                  </span>
                  <span className="line-through text-gray-500">
                    {t('products.detail.regularPrice', { defaultValue: 'Regular Price' })}: €{product.regular_price}
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    {discountPercentage}% {t('products.view.discount', { defaultValue: 'OFF' })}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">
                  {t('products.detail.regularPrice', { defaultValue: 'Price' })}: €{product.regular_price}
                </span>
              )}
            </div>

            {/* Variants */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="mt-6">
                {product.attributes.map(attribute => (
                  <div key={attribute.id} className="mb-4">
                    <h3 className="font-semibold mb-2">
                      {t(`products.detail.variant.${attribute.name}`, { defaultValue: attribute.name })}
                    </h3>
                    <div className="flex space-x-2 flex-wrap">
                      {attribute.options.map(option => (
                        <button
                          key={option}
                          className={`px-3 py-1 border rounded ${
                            selectedVariants[attribute.name] === option
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700'
                          }`}
                          onClick={() => handleVariantSelect(attribute.name, option)}
                        >
                          {t(`products.detail.variantOption.${attribute.name}.${option}`, { defaultValue: option })}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add to Cart Button */}
                          <button
                onClick={handleAddToCart}
                className="w-full mt-6 bg-primary text-white font-semibold px-4 py-1.5 rounded-full flex items-center justify-center space-x-1.5 hover:bg-primary/90 transition duration-300"
              >
                <ShoppingCart size={18} />
                <span>{t('products.view.addToCart', { defaultValue: 'Add to Cart' })}</span>
              </button>
            {/* Tabs: Description, Additional Info */}
            <div className="mt-10">
              <div className="flex border-b">
                <button
                  className={`py-3 px-6 font-semibold ${
                    activeTab === 'description' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  {t('products.view.description', { defaultValue: 'Description' })}
                </button>
                <button
                  className={`py-3 px-6 font-semibold ${
                    activeTab === 'additional' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('additional')}
                >
                  {t('products.view.additionalInfo', { defaultValue: 'Additional Info' })}
                </button>
              </div>

              <div className="mt-6 text-gray-800">
                {activeTab === 'description' && (
                  <div dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                )}
                {activeTab === 'additional' && (
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('products.view.shortDescription', { defaultValue: 'Short Description' })}
                    </h4>
                    <div dangerouslySetInnerHTML={{ __html: product.short_description || '' }} />
                    <h4 className="font-semibold mt-4 mb-2">
                      {t('products.view.attributes', { defaultValue: 'Attributes' })}
                    </h4>
                    <ul className="list-disc ml-6">
                      {product.attributes.map(attr => (
                        <li key={attr.id}>
                          <strong>
                            {t(`products.detail.variant.${attr.name}`, { defaultValue: attr.name })}:{' '}
                          </strong>
                          {attr.options
                            .map(option =>
                              t(`products.detail.variantOption.${attr.name}.${option}`, { defaultValue: option })
                            )
                            .join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping, Guarantee, Return Icons */}
            <div className="mt-10 flex space-x-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Truck />
                <span>{t('products.view.freeShipping', { defaultValue: 'Free Shipping' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield />
                <span>{t('products.view.guarantee', { defaultValue: 'Satisfaction Guarantee' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw />
                <span>{t('products.view.easyReturns', { defaultValue: 'Easy Returns' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
