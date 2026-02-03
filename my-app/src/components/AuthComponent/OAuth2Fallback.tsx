import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function OAuthCallback() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("access_token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    login(token);
    navigate("/todos", { replace: true });
  }, [location.search, login, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border" role="status" />
        <div className="mt-3 text-muted">Signing you in...</div>
      </div>
    </div>
  );
}
