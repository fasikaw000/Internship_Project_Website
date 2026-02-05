import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addProduct, updateProduct, getProductById } from "../../services/productService";
import { Link } from "react-router-dom";

export default function AddEditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: "",
        category: "all",
        price: "",
        stock: "",
        description: "",
        image: null,
    });

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            getProductById(id)
                .then((data) => {
                    setFormData({
                        name: data.name,
                        category: data.category || "all",
                        price: data.price,
                        stock: data.stock,
                        description: data.description,
                        image: null, // Keep existing image unless changed
                    });
                    if (data.image) {
                        const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");
                        setPreview(`${API_BASE}/uploads/products/${data.image}`);
                    }
                })
                .catch(() => setError("Failed to load product details"))
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("category", formData.category);
            data.append("price", formData.price);
            data.append("stock", formData.stock);
            data.append("description", formData.description);
            if (formData.image) {
                data.append("image", formData.image);
            }

            if (isEditMode) {
                await updateProduct(id, data);
                alert("Product updated successfully!");
            } else {
                await addProduct(data);
                alert("Product added successfully!");
            }
            navigate("/products");
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode && !formData.name) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto animate-fadeIn">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-slate-900">{isEditMode ? "Edit Product" : "Add New Product"}</h2>
                <Link to="/products" className="text-indigo-600 hover:underline font-medium">Cancel</Link>
            </div>

            {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-lg border border-red-200">{error}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. Premium Leather Jacket"
                    />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="electronics">Electronics</option>
                            <option value="fashions">Fashions</option>
                            <option value="books">Books</option>
                            <option value="all">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Price (ETB)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Stock Quantity</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. 100"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        placeholder="Describe the product..."
                    ></textarea>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Product Image</label>
                    <div className="flex items-start gap-6">
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />
                            <p className="mt-2 text-xs text-slate-400">Supported formats: JPG, PNG, WEBP</p>
                        </div>
                        {preview && (
                            <div className="w-24 h-24 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
                </button>
            </form>
        </div>
    );
}
