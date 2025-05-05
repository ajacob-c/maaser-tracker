import { useState } from "react"
import axios from "axios"
import "./TzedakaForm.css"

const TzedakaForm = ({ onSuccess }) => {
    const [organization, setOrganization] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        axios.post("http://localhost:5000/tzedaka/add", {
            organization,
            amount: parseFloat(amount),
            date,
            userId
        }, {
            headers: {
                Authorization: token
            }
        })
        .then(() => {
            setOrganization("");
            setAmount("");
            setDate("");
            setError("");
            if (onSuccess) onSuccess();
        })
        .catch((error) => {
            setError("Failed to add tzedaka. Please try again.");
            console.error("Error adding tzedaka:", error);
        });
    };

    return (
        <div className="tzedaka-form">
            <h2>Add Tzedaka</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Organization</label>
                    <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
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
                    Add Tzedaka
                </button>
            </form>
        </div>
    );
};

export default TzedakaForm;