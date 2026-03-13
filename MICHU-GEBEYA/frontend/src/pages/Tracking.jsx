import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";

export default function Tracking() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyOrders().then(orders => {
            const found = orders.find(o => o._id === id);
            setOrder(found);
        }).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
    if (!order) return <div className="p-10 text-center text-red-500 font-bold">Order not found.</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 min-h-screen animate-fadeIn">
            <Link to="/orders" className="text-indigo-600 font-bold hover:underline mb-8 inline-block">← Back to Orders</Link>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 p-8 text-center">
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Tracking Order</h1>
                    <p className="text-slate-500 font-mono text-sm tracking-wider">#{order._id.toUpperCase()}</p>
                </div>

                <div className="p-8">
                    {/* Status History Timeline */}
                    <div className="relative border-l-2 border-slate-200 ml-4 space-y-10 my-8">
                        {order.statusHistory?.map((history, idx) => (
                            <div key={idx} className="relative pl-8">
                                {/* Dot */}
                                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm ring-1 ring-slate-200"></div>

                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 capitalize mb-1">{history.status.replace("_", " ")}</h3>
                                        <p className="text-slate-600">{history.comment}</p>
                                    </div>
                                    <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                        {new Date(history.timestamp || order.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Current Status Box */}
                    <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                        <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2">Current Status</p>
                        <h2 className="text-3xl font-extrabold text-indigo-900 capitalize">{order.status.replace("_", " ")}</h2>
                        {order.status === "delivered" && <p className="text-indigo-600 mt-2">✨ delivered to {order.deliveryInfo.address}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
