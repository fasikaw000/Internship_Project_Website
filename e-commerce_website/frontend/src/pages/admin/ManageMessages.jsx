import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ManageMessages() {
    const [messages, setMessages] = useState([]);

    const loadMessages = async () => {
        try {
            const res = await api.get("/comments");
            setMessages(res.data);
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const deleteMessage = async (id) => {
        try {
            await api.delete(`/comments/${id}`);
            loadMessages();
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-4">
                <Link to="/admin" className="text-indigo-600 hover:underline text-sm font-bold uppercase tracking-widest">← Back to Dashboard</Link>
            </div>
            <h2 className="text-2xl font-black mb-8 text-slate-800 uppercase tracking-tighter italic">Manage <span className="text-teal-500">Messages</span></h2>

            {messages.length === 0 ? (
                <p className="text-slate-400 font-medium italic">No messages found in the system.</p>
            ) : (
                messages.map((m) => (
                    <div key={m._id} className="bg-white border border-slate-100 rounded-[2rem] p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="font-bold text-slate-900 leading-none">
                                    {m.user?.fullName ?? m.name ?? "Guest User"}
                                </p>
                                {m.user?.email && <p className="text-teal-600 text-xs font-medium mt-1">{m.user.email}</p>}
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                {new Date(m.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl mb-4">
                            <p className="text-slate-600 text-sm leading-relaxed">"{m.message}"</p>
                        </div>
                        <button
                            onClick={() => deleteMessage(m._id)}
                            className="px-6 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        >
                            Delete Permanently
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
