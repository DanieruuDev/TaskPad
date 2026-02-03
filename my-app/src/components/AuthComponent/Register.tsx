import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type RegisterProps = {
  onSwitch: () => void;
};

function Register({ onSwitch }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPassword] = useState("");
  const [isMatch, setIsMatch] = useState<boolean>();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}register`,
        {
          username,
          email,
          password,
        },
        { withCredentials: true },
      );

      if (response.status === 201) {
        toast.success("Registration Completed", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        onSwitch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkPasswordMatch = () => {
      if (password === "" && confirmPass === "") return;
      console.log();
      return setIsMatch(password === confirmPass);
    };
    checkPasswordMatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmPass]);

  return (
    <div
      className="card p-4 shadow"
      style={{ width: "100%", maxWidth: "400px" }}
    >
      <h4 className="text-center mb-4">Register</h4>

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            maxLength={40}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            maxLength={60}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control  ${isMatch === false ? "is-invalid" : ""}`}
            placeholder="Create password"
            value={password}
            maxLength={40}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>

          <input
            type="password"
            className={`form-control ${isMatch === false ? "is-invalid" : ""}`}
            placeholder="Confirm password"
            value={confirmPass}
            maxLength={40}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {isMatch === false && (
            <div className="invalid-feedback">Passwords do not match.</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={!isMatch || !username || !email}
        >
          Register
        </button>

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <button
              type="button"
              className="btn btn-link p-0 align-baseline"
              onClick={onSwitch}
            >
              Login
            </button>
          </small>
        </div>
      </form>
    </div>
  );
}

export default Register;
