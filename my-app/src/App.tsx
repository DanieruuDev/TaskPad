import { Route, Routes } from "react-router";
import AuthenticationPage from "./page/AuthenticationPage";
import ProtectedRoute from "./components/AuthComponent/ProtectedRoute";
import TodoList from "./page/Todo/TodoList";
import OAuthCallback from "./components/AuthComponent/OAuth2Fallback";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <Routes>
        {/* public */}
        <Route index element={<AuthenticationPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* private group */}
        <Route element={<ProtectedRoute />}>
          <Route path="/todos" element={<TodoList />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
