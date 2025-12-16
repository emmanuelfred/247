import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

export default function ProtectedRoute({ children }) {
  const token = useUserStore((s) => s.accessToken);
  console.log("ProtectedRoute token:", token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
