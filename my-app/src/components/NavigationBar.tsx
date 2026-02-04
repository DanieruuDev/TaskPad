import { useAuth } from "../context/AuthContext";

function NavigationBar() {
  const { logout } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid">
        {/* App name */}
        <span className="navbar-brand fw-semibold">TaskPad</span>

        {/* Right side */}
        <div className="d-flex align-items-center gap-3 ms-auto">
          {/* Profile */}
          <div className="dropdown">
            <button
              className="btn btn-light d-flex align-items-center gap-2 dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div
                className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32, fontSize: 13 }}
              >
                N/A
              </div>
              <span className="d-none d-md-inline">You</span>
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item">Profile</button>
              </li>
              <li>
                <button className="dropdown-item">Settings</button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
