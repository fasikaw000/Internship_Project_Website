import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";

export default function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 bg-slate-200 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
