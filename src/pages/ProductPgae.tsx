import React from "react";
import { useParams } from "react-router-dom";
import WooProductDetailContainer from "../components/WooProductDetailContainer";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Loading...</div>;

  const productId = Number(id);

  if (isNaN(productId)) return <div>Invalid product ID.</div>;

  return <WooProductDetailContainer productId={productId} />;
};

export default ProductPage;
