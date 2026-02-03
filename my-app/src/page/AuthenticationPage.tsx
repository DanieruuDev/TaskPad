import { useState } from "react";
import Login from "../components/AuthComponent/Login";
import Register from "../components/AuthComponent/Register";

function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      {isLogin ? (
        <Login onSwitch={() => setIsLogin(false)} />
      ) : (
        <Register onSwitch={() => setIsLogin(true)} />
      )}
    </div>
  );
}

export default AuthenticationPage;
