import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ManageComments() {
  const [comments, setComments] = useState([]);

  const loadComments = async () => {
    const res = await api.get("/comments");
    setComments(res.data);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const deleteComment = async (id) => {
    await api.delete(`/comments/${id}`);
    loadComments();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link to="/admin" className="text-indigo-600 hover:underline text-sm">← Back to Dashboard</Link>
      </div>
      <h2 className="text-xl font-bold mb-4">Manage Comments</h2>

      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        comments.map((c) => (
          <div key={c._id} className="border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm">
            <p className="text-gray-700">
              <strong>{c.user?.fullName ?? c.name ?? "Guest"}</strong>
              {c.user?.email && <span className="text-gray-500 text-sm ml-2">({c.user.email})</span>}
              : {c.message}
            </p>
            {c.adminReply && <p className="mt-2 text-sm text-indigo-600">Reply: {c.adminReply}</p>}
            <button
              onClick={() => deleteComment(c._id)}
              className="text-red-600 text-sm mt-2 hover:underline"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
