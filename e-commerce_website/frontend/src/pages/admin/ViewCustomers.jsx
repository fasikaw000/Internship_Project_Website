import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ViewCustomers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load customers"));
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <Link to="/admin" className="text-indigo-600 hover:underline text-sm block mb-2">← Back to Dashboard</Link>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/admin" className="text-indigo-600 hover:underline text-sm">← Back to Dashboard</Link>
      </div>
      <h2 className="text-xl font-bold mb-4">Customers</h2>

      {users.length === 0 ? (
        <p className="text-gray-500">No customers yet.</p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <p className="font-medium">Name: {u.fullName}</p>
              <p className="text-gray-600">Email: {u.email}</p>
              <p className="text-sm text-gray-500">Role: {u.role ?? "user"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
