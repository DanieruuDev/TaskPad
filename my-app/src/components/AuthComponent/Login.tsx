import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";

type LoginProps = {
  onSwitch: () => void;
};

function Login({ onSwitch }: LoginProps) {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const from = (location.state as any)?.from?.pathname || "/todos";

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username || !password) {
      setErrorMsg("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${apiUrl}login`,
        { username, password },
        { withCredentials: true },
      );
      toast.success("Login Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      login(res.data.access_token);
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      setErrorMsg("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${apiUrl}oauth2/authorization/google`;
  };

  const loginWithGithub = () => {
    window.location.href = `${apiUrl}auth2/authorization/github`;
  };

  return (
    <div
      className="card p-4 shadow"
      style={{ width: "100%", maxWidth: "400px" }}
    >
      <h4 className="text-center mb-4">Login</h4>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email / Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            value={username}
            disabled={loading}
            maxLength={60}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            disabled={loading}
            maxLength={60}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 mt-3">{errorMsg}</div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100 mt-3"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 text-muted small">OR</span>
          <hr className="flex-grow-1" />
        </div>

        {/* OAuth Buttons */}
        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2"
            onClick={loginWithGoogle}
            disabled={loading}
          >
            <span style={{ fontSize: "1.1rem" }}>
              <img src="google.png" alt="google" width={24} />
            </span>
            Continue with Google
          </button>
          <button
            type="button"
            className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2"
            onClick={loginWithGithub}
            disabled={loading}
          >
            <span
              className="d-flex align-items-center justify-content-center bg-light rounded-circle"
              style={{ width: "19px", height: "19px" }}
            >
              <img src="github.png" alt="github" width={20} />
            </span>
            Continue with GitHub
          </button>
        </div>

        <div className="text-center mt-3">
          <small>
            Don’t have an account?{" "}
            <button
              type="button"
              className="btn btn-link p-0 align-baseline"
              onClick={onSwitch}
              disabled={loading}
            >
              Register
            </button>
          </small>
        </div>
      </form>
    </div>
  );
}

export default Login;
