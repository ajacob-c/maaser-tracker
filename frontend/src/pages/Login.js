import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:5000/auth/login", { email, password }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setToken(data.token);
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            navigate("/");
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      );
};

export default Login;