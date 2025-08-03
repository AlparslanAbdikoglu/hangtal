import React, { useEffect, useState } from 'react';
import ProductDetailPage, { Product } from './ProductDetailPage';

interface WooProductDetailContainerProps {
  productId?: number;  // Optional numeric ID
  productSlug?: string; // Optional slug
}

const WooProductDetailContainer: React.FC<WooProductDetailContainerProps> = ({ productId, productSlug }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const consumerKey = import.meta.env.VITE_WOO_CONSUMER_KEY;
  const consumerSecret = import.meta.env.VITE_WOO_CONSUMER_SECRET;
  const apiUrl = import.meta.env.VITE_WOO_API_URL;
  const auth = btoa(`${consumerKey}:${consumerSecret}`);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = '';

        if (productId) {
          // Fetch by numeric ID
          url = `${apiUrl}/products/${productId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
        } else if (productSlug) {
          // Fetch by slug (returns array)
          url = `${apiUrl}/products?slug=${productSlug}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
        } else {
          throw new Error('No product ID or slug provided');
        }

        const res = await fetch(url, {
          headers: { Authorization: `Basic ${auth}` },
        });

        if (!res.ok) {
          throw new Error(`WooCommerce API error: ${res.statusText}`);
        }

        let data = await res.json();

        // If fetching by slug, pick the first match
        if (Array.isArray(data)) {
          if (data.length === 0) throw new Error('Product not found');
          data = data[0];
        }

        const productData: Product = {
          id: data.id,
          name: data.name,
          description: data.description,
          short_description: data.short_description,
          regular_price: data.regular_price,
          sale_price: data.sale_price,
          stock_quantity: data.stock_quantity,
          images: data.images || [],
          attributes: data.attributes || [],
        };

        setProduct(productData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, productSlug, consumerKey, consumerSecret, apiUrl]);

  if (loading) return <div className="text-center py-10">Loading product...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (!product) return <div className="text-center py-10">Product not found.</div>;

  return <ProductDetailPage product={product} />;
};

export default WooProductDetailContainer;
