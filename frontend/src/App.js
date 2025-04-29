import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        {/* Default route: if logged in, go dashboard, else login */}
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        
        {/* Login page */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        
        {/* Register page */}
        <Route path="/register" element={<Register setToken={setToken} />} />
      </Routes>
    </Router>
  );
};
export default App;