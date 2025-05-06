import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css"

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/auth/register", { email, password }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-container panel">
                <h2 className="register-title form-title">Register</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form form-container">
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
                        Register
                    </button>
                </form>

                <p className="login-link">
                    Already have an account?{' '}
                    <Link to="/login">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;