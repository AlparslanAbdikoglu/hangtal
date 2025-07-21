import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleProductData } from "../lib/api";
// Update the import path if the file is located elsewhere, for example:
import { myStoreHook } from "../MyStoreContext";

interface Image {
  id: number;
  src: string;
  alt?: string;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  images?: Image[];
  categories?: Category[];
  [key: string]: any; // fallback for unexpected fields
}

interface SingleProductProps {
  setPageLoading: (loading: boolean) => void;
  onAddToCart: (product: Product) => void;
}

const SingleProduct: React.FC<SingleProductProps> = ({ setPageLoading, onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const { renderProductPrice } = myStoreHook();
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      setPageLoading(true);
      try {
        const data = await getSingleProductData(id);
        setSingleProduct(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchSingleProduct();
  }, [id, setPageLoading]);

  if (!singleProduct) return null;

  return (
    <div className="container my-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <div className="card">
            <img
              className="card-img-top"
              src={singleProduct?.images?.[0]?.src}
              alt={singleProduct?.images?.[0]?.alt || "Product Image"}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h1 className="my-4">{singleProduct.name}</h1>

          <div
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: singleProduct.description }}
          />

          <div className="mb-4">
            <h5>Price:</h5>
            {renderProductPrice(singleProduct)}
          </div>

          <div className="mb-4">
            <h5>
              Category:{" "}
              {singleProduct?.categories
                ?.map((cat) => cat.name)
                .join(", ") || "None"}
            </h5>
          </div>

          <button
            className="btn btn-primary mt-4"
            onClick={() => onAddToCart(singleProduct)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
