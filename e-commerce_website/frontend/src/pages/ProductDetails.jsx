import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id).then(setProduct);
  }, [id]);

  if (!product) return null;

  return (
    <div className="p-6">
      <ProductCard product={product} />
    </div>
  );
}
