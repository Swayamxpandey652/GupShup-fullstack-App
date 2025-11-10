import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/chat" : "/login"} />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/chat" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/chat" />} />
        <Route path="/chat" element={token ? <Chat /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
