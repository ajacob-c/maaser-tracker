import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css"

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/auth/register", {email, password}, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            alert("Registered successfully! Please login.");
            navigate("/login");
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-container">
                <h2 className="register-title">Register</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="register-input"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="register-input"
                        />
                    </div>
                    <button type="submit" className="register-button">
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