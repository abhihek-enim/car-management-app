import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check if token exists and is valid (you might want to add additional checks here)
    if (!token) {
      // If no token, redirect to login
      navigate("/login");
    }
  }, [token, navigate]); // Add token and navigate as dependencies

  // Render children if token exists
  return token ? children : null;
};

export default ProtectedRoute;
