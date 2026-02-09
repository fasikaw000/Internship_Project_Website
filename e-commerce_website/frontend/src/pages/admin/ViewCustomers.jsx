import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function ViewCustomers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useContext(AuthContext);

  const [notification, setNotification] = useState(null);
  const showNotification = (msg, type = "error") => {
    setNotification({ msg, type });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchUsers = () => {
    setLoading(true);
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load customers"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    // NOTE: In current UI, this is not wired up, but the logic should be clean
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <Link to="/admin" className="text-indigo-600 hover:underline text-sm block mb-2">← Back to Dashboard</Link>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto relative min-h-screen">
      <div className="mb-4">
        <Link to="/admin" className="text-indigo-600 hover:underline text-sm font-semibold italic">← Back to Dashboard</Link>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`mb-6 p-4 rounded-2xl border animate-slideDown flex items-center gap-3 shadow-sm ${notification.type === "success"
          ? "bg-emerald-50 border-emerald-100 text-emerald-800"
          : "bg-rose-50 border-rose-100 text-rose-800"
          }`}>
          <span className="text-xl">{notification.type === "success" ? "✅" : "⚠️"}</span>
          <p className="font-bold text-sm tracking-tight">{notification.msg}</p>
        </div>
      )}

      <h2 className="text-2xl font-extrabold mb-6 text-slate-900 tracking-tight uppercase">User Management</h2>

      {loading && <p className="text-gray-500 mb-4 font-body animate-pulse">Updating list...</p>}

      {users.length === 0 && !loading ? (
        <p className="text-gray-500">No customers yet.</p>
      ) : (
        <div className="space-y-4">
          {users.map((u) => {
            const isSelf = currentUser?.id === u._id;
            return (
              <div key={u._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">{u.fullName}</p>
                  <p className="text-gray-600">{u.email}</p>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role?.toUpperCase() || "USER"}
                    </span>
                    {isSelf && <span className="text-xs italic text-gray-400 font-body">(You)</span>}
                  </div>
                </div>

                {!isSelf && (
                  <div className="mt-4 md:mt-0 flex items-center space-x-3 text-slate-400 italic text-xs">
                    Customer Details View-Only
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
