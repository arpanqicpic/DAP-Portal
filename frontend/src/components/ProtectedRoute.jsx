import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element }) => {
  const sessionId = Cookies.get("session_id");

  return sessionId ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
