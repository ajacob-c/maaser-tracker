import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css"

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
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
            setError(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container panel">
                <h2 className="login-title form-title">Login</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form form-container">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Login
                    </button>
                </form>

                <p className="register-link">
                    Don't have an account?{' '}
                    <Link to="/register">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;