import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Grid.css";
import { formatAmount } from "../utils/format";

const TzedakaGrid = ({ selectedDate, isYearlyView }) => {
    const [tzedakas, setTzedakas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTzedakas = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");
                const year = selectedDate.getFullYear();
                
                let endpoint;
                if (isYearlyView) {
                    endpoint = `http://localhost:5000/tzedaka/user/${userId}?year=${year}`;
                } else {
                    const month = selectedDate.getMonth() + 1;
                    endpoint = `http://localhost:5000/tzedaka/user/${userId}?month=${month}&year=${year}`;
                }
                
                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setTzedakas(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch tzedaka data");
                setLoading(false);
            }
        };

        fetchTzedakas();
    }, [selectedDate, isYearlyView]);

    if (loading) return <div className="loading">Loading tzedaka data...</div>;
    if (error) return <div className="error">{error}</div>;

    if (isYearlyView) {
        // Group tzedaka by month
        const monthlyTzedaka = Array(12).fill().map((_, monthIndex) => {
            const monthTzedaka = tzedakas.filter(tzedaka => {
                const date = new Date(tzedaka.date);
                return date.getMonth() === monthIndex && date.getFullYear() === selectedDate.getFullYear();
            });

            const totalAmount = monthTzedaka.reduce((sum, tzedaka) => sum + tzedaka.amount, 0);
            const monthName = new Date(selectedDate.getFullYear(), monthIndex, 1)
                .toLocaleString('default', { month: 'long' });

            return {
                month: monthName,
                tzedaka: monthTzedaka,
                totalAmount
            };
        });

        return (
            <div className="grid-container">
                <h2>Tzedaka Details - {selectedDate.getFullYear()}</h2>
                <table className="data-grid">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Total Tzedaka</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyTzedaka.map((monthData, index) => (
                            <tr key={index} className="yearly-row">
                                <td>{monthData.month}</td>
                                <td>${formatAmount(monthData.totalAmount)}</td>
                                <td className="details-cell">
                                    {monthData.tzedaka.length > 0 && (
                                        <table className="nested-table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Organization</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {monthData.tzedaka.map((tzedaka) => (
                                                    <tr key={tzedaka._id}>
                                                        <td>{new Date(tzedaka.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
                                                        <td>{tzedaka.organization}</td>
                                                        <td>${formatAmount(tzedaka.amount)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="grid-container">
            <h2>Tzedaka Details - {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <table className="data-grid">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Organization</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {tzedakas.map((tzedaka) => (
                        <tr key={tzedaka._id}>
                            <td>{new Date(tzedaka.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
                            <td>{tzedaka.organization}</td>
                            <td>${formatAmount(tzedaka.amount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TzedakaGrid; 