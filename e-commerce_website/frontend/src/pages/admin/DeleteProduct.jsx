import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { deleteProduct } from "../../services/productService";

export default function DeleteProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProduct(id);
            alert("Product deleted successfully.");
            navigate("/products");
        } catch (err) {
            alert("Failed to delete product.");
            setDeleting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

    return (
        <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg border border-red-100 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🗑️
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Delete Product?</h2>
            <p className="text-slate-600 mb-6">
                Are you sure you want to delete <span className="font-bold text-slate-900">"{product.name}"</span>?
                This action cannot be undone.
            </p>

            <div className="flex gap-3">
                <Link
                    to="/products"
                    className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                    Cancel
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition shadow-lg hover:shadow-red-200 disabled:opacity-50"
                >
                    {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
            </div>
        </div>
    );
}
