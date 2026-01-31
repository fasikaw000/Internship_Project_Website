import { useAuth } from "../hooks/useAuth";

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <p>Name: {user.fullName}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
