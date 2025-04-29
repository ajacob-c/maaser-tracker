import {useState} from "react";
import axios from "axios";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        // await axios.post("http://localhost:5000/auth/register", {email, password});
        await axios.post("http://127.0.0.1:5000/auth/register", {email, password}, {
            headers: {
              "Content-Type": "application/json"
            }
          });
        alert("Registered! Please login");
    };

    return(
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;