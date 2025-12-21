import React, { useEffect, useState } from "react";
import ProductDetailPage, { Product } from "./ProductDetailPage";

interface WooProductDetailContainerProps {
  productId?: number;
  productSlug?: string;
}

const productCache = new Map<number | string, Product>();

const WooProductDetailContainer: React.FC<WooProductDetailContainerProps> = ({
  productId,
  productSlug,
}) => {
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
        // Check cache first
        const cacheKey = productId ?? productSlug!;
        if (productCache.has(cacheKey)) {
          setProduct(productCache.get(cacheKey)!);
          setLoading(false);
          return;
        }

        let url = "";
        if (productId) {
          url = `${apiUrl}/products/${productId}`;
        } else if (productSlug) {
          url = `${apiUrl}/products?slug=${productSlug}`;
        } else {
          throw new Error("No product ID or slug provided");
        }

        const res = await fetch(url, {
          headers: { Authorization: `Basic ${auth}` },
        });

        if (!res.ok) {
          throw new Error(`WooCommerce API error: ${res.statusText}`);
        }

        let data = await res.json();
        if (Array.isArray(data)) {
          if (data.length === 0) throw new Error("Product not found");
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

        productCache.set(cacheKey, productData);
        setProduct(productData);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, productSlug, apiUrl, auth]);

  if (loading) {
    return (
      <div className="p-8 animate-pulse space-y-6 max-w-4xl mx-auto">
        <div className="h-8 w-1/3 bg-muted rounded" />
        <div className="h-96 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>
    );
  }

  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (!product) return <div className="text-center py-10">Product not found.</div>;

  return <ProductDetailPage product={product} />;
};

export default WooProductDetailContainer;
