import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function AdminHistory() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/logs");
            console.log("[AdminHistory] Fetched logs:", res.data);
            setLogs(Array.isArray(res.data) ? res.data : []);
            setError(null);
        } catch (err) {
            console.error("[AdminHistory] Fetch error:", err);
            setError("Failed to fetch audit logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    if (loading) return <div className="p-6 text-center">Loading logs...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
            <div className="mb-4 flex justify-between items-center">
                <Link to="/admin" className="text-indigo-600 hover:underline text-sm font-semibold italic">← Back to Dashboard</Link>
                <button
                    onClick={fetchLogs}
                    className="bg-white border border-slate-200 px-4 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
                >
                    <svg className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh Logs
                </button>
            </div>
            <h2 className="text-3xl font-extrabold mb-8 text-slate-900 tracking-tight">Admin History</h2>

            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                {/* Desktop View: Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin</th>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</th>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {logs.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-800">
                                        {log.admin?.fullName || "Unknown Admin"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${log.action.includes('DELETE') ? 'bg-red-100 text-red-700' :
                                            log.action.includes('ADD') ? 'bg-green-100 text-green-700' :
                                                'bg-indigo-100 text-indigo-700'
                                            }`}>
                                            {log.action.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                                        {log.target}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                                        {JSON.stringify(log.details)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View: Cards */}
                <div className="block sm:hidden divide-y divide-slate-100">
                    {logs.map((log) => (
                        <div key={log._id} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${log.action.includes('DELETE') ? 'bg-red-100 text-red-700' :
                                    log.action.includes('ADD') ? 'bg-green-100 text-green-700' :
                                        'bg-indigo-100 text-indigo-700'
                                    }`}>
                                    {log.action.replace(/_/g, " ")}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">{new Date(log.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800">{log.admin?.fullName || "Unknown Admin"}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{log.target}</p>
                            </div>
                            {log.details && (
                                <div className="p-2 bg-slate-50 rounded italic text-[10px] text-slate-500 break-words">
                                    {JSON.stringify(log.details)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {logs.length === 0 && (
                    <div className="p-16 text-center bg-slate-50">
                        <div className="mb-4 flex justify-center text-slate-200">
                            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-slate-500 font-bold">No admin records found.</p>
                        <p className="text-slate-400 text-xs mt-1">Activities such as product updates or order status changes will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
