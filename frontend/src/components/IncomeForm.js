import { useState } from "react"
import axios from "axios"
import "../styles/IncomeForm.css"

const IncomeForm = ({ onSuccess }) => {
    const [source, setSource] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        axios.post("http://localhost:5000/income/add", {
            source,
            amount: parseFloat(amount),
            date,
            userId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            setSource("");
            setAmount("");
            setDate("");
            setError("");
            if (onSuccess) onSuccess();
        })
        .catch((error) => {
            setError("Failed to add income. Please try again.");
            console.error("Error adding income:", error);
        });
    };

    return (
        <div className="income-form">
            <h3>Add Income</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Source</label>
                    <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    className="submit-button"
                >
                    Add Income
                </button>
            </form>
        </div>
    );
};

export default IncomeForm;