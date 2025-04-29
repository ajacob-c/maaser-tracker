import { useState } from "react"
import axios from "axios"

const IncomeForm = () => {
    const [amount, setAmount] = useState("");
    const [source, setSource] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post("http://localhost:5000/income/add", { amount, source, date }, {
                headers: { Authorization: token },
            });
            alert("Income Added Successfully!");
            onSuccess(); // 🔥 Refresh dashboard summary!
            setAmount("");
            setSource("");
            setDate("");

        } catch (error) {
            console.error(error);
            alert("Failed to add income.");
        }

    };

    return (
        <div>
            <h3>Add Income</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Source" value={source} onChange={(e) => setSource(e.target.value)} required />
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <button type="submit">Add Income</button>
            </form>
        </div>
    );
};

export default IncomeForm