import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      // Check if token is expired by decoding it
      try {
        const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (tokenPayload.exp > currentTime) {
          // Token is still valid
          setToken(storedToken);
        } else {
          // Token is expired, clear it
          console.log('Token expired, clearing stored credentials');
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setToken(null);
        }
      } catch (error) {
        // Token is malformed, clear it
        console.log('Token malformed, clearing stored credentials');
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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