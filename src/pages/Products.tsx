import React, { useEffect, useState } from "react";
import { getProducts } from "../api/woocommerce";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message || "Failed to load products"));
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      {products.length === 0 && <p>Loading...</p>}
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} — ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
