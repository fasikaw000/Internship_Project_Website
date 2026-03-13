import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";

export default function Invoice() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

    useEffect(() => {
        // In a real app we might have a specific getOrderById endpoint,
        // but getMyOrders filtered is fine for now or we can add getOrderById.
        // Let's assume getMyOrders returns all and we filter, or better, use getOrderById if available.
        // I checked productService but not orderService for getById. 
        // Checking orderService... actually I will just use getMyOrders and find it for safety 
        // to avoid adding new backend routes if not needed, preserving scope.
        getMyOrders().then(orders => {
            const found = orders.find(o => o._id === id);
            setOrder(found);
        }).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-10">Loading Invoice...</div>;
    if (!order) return <div className="p-10 text-red-500">Invoice not found.</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-10 min-h-screen text-slate-800 font-serif">
            <Link to="/orders" className="text-indigo-600 font-bold hover:underline mb-8 inline-block no-print">← Back to Orders</Link>

            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">INVOICE</h1>
                    <p className="text-sm font-semibold mt-2">Invoice #: {order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                        MICHU<span className="text-teal-600">GEBEYA</span>
                    </h2>
                    <p className="text-sm">Addis Ababa, Ethiopia</p>
                    <p className="text-sm">aytenfasikaw21@gmail.com</p>
                </div>
            </div>

            {/* Bill To / Ship To */}
            <div className="flex justify-between mb-10">
                <div>
                    <h3 className="font-bold uppercase text-xs tracking-widest text-slate-500 mb-2">Bill To:</h3>
                    <p className="font-bold">{order.user?.fullName || order.deliveryInfo?.name}</p>
                    <p>{order.user?.email}</p>
                </div>
                <div className="text-right">
                    <h3 className="font-bold uppercase text-xs tracking-widest text-slate-500 mb-2">Ship To:</h3>
                    <p className="font-bold">{order.deliveryInfo?.name}</p>
                    <p>{order.deliveryInfo?.address}</p>
                    <p>{order.deliveryInfo?.phone}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-10 border-collapse">
                <thead>
                    <tr className="border-b border-slate-300">
                        <th className="text-left py-3 font-bold uppercase text-xs">Item</th>
                        <th className="text-right py-3 font-bold uppercase text-xs">Qty</th>
                        <th className="text-right py-3 font-bold uppercase text-xs">Unit Price</th>
                        <th className="text-right py-3 font-bold uppercase text-xs">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.products.map((p, i) => (
                        <tr key={i} className="border-b border-slate-100">
                            <td className="py-4">
                                <p className="font-bold">{p.product?.name || "Item"}</p>
                                <p className="text-xs text-slate-500">{p.product?._id}</p>
                            </td>
                            <td className="text-right py-4">{p.quantity}</td>
                            <td className="text-right py-4">{p.product?.price?.toFixed(2)}</td>
                            <td className="text-right py-4">{(p.product?.price * p.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-1/2 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{order.totalPrice?.toFixed(2)} ETB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>0.00 ETB</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl border-t-2 border-slate-800 pt-3">
                        <span>Total</span>
                        <span>{order.totalPrice?.toFixed(2)} ETB</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-500 mt-20">
                <p>Thank you for your business!</p>
                <p>If you have any questions about this invoice, please contact aytenfasikaw21@gmail.com</p>
            </div>

            {/* Print Button (Hide when printing) */}
            <div className="fixed bottom-8 right-8 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-xl hover:bg-indigo-700 transition"
                >
                    Print Invoice
                </button>
            </div>
        </div>
    );
}
