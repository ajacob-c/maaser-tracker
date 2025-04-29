import { useState } from "react"
import axios from "axios"

const TzedakaForm = () => {
    const [amount, setAmount] = useState("");
    const [organization, setOrganization] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post("http://localhost:5000/tzedaka/add", { amount, organization, date }, {
                headers: { Authorization: token },
            });
            alert("Tzedaka donation logged successfully!");
            onSuccess(); // 🔥 Refresh dashboard summary!
            setAmount("");
            setOrganization("");
            setDate("");
        } catch (error) {
            console.error(error);
            alert("Failed to add tzedaka.");
        }
    };

    return (
        <div>
            <h3>Add Tzedaka</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Organization" value={organization} onChange={(e) => setOrganization(e.target.value)} required />
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <button type="submit">Add Tzedaka</button>
            </form>
        </div>
    );

};

export default TzedakaForm;