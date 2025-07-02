import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Grid.css";
import { formatAmount } from "../utils/format";

const IncomeGrid = ({ selectedDate, isYearlyView }) => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchIncomes = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");
                const year = selectedDate.getFullYear();
                
                let endpoint;
                if (isYearlyView) {
                    endpoint = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/income/user/${userId}?year=${year}`;
                } else {
                    const month = selectedDate.getMonth() + 1;
                    endpoint = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/income/user/${userId}?month=${month}&year=${year}`;
                }
                
                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Handle new response format with status and data properties
                const responseData = response.data;
                if (responseData.status === 'success' && responseData.data) {
                    setIncomes(responseData.data);
                } else {
                    // Fallback for old format or direct data
                    setIncomes(responseData || []);
                }
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch income data");
                setLoading(false);
            }
        };

        fetchIncomes();
    }, [selectedDate, isYearlyView]);

    if (loading) return <div className="loading">Loading income data...</div>;
    if (error) return <div className="error">{error}</div>;

    if (isYearlyView) {
        // Group incomes by month
        const monthlyIncomes = Array(12).fill().map((_, monthIndex) => {
            const monthIncomes = incomes.filter(income => {
                const date = new Date(income.date);
                return date.getMonth() === monthIndex && date.getFullYear() === selectedDate.getFullYear();
            });

            const totalAmount = monthIncomes.reduce((sum, income) => sum + income.amount, 0);
            const monthName = new Date(selectedDate.getFullYear(), monthIndex, 1)
                .toLocaleString('default', { month: 'long' });

            return {
                month: monthName,
                incomes: monthIncomes,
                totalAmount
            };
        });

        return (
            <div className="grid-container">
                <h2>Income Details - {selectedDate.getFullYear()}</h2>
                <table className="data-grid">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Total Income</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyIncomes.map((monthData, index) => (
                            <tr key={index} className="yearly-row">
                                <td>{monthData.month}</td>
                                <td>${formatAmount(monthData.totalAmount)}</td>
                                <td className="details-cell">
                                    {monthData.incomes.length > 0 && (
                                        <table className="nested-table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Source</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {monthData.incomes.map((income) => (
                                                    <tr key={income._id}>
                                                        <td>{new Date(income.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
                                                        <td>{income.source}</td>
                                                        <td>${formatAmount(income.amount)}</td>
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
            <h2>Income Details - {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <table className="data-grid">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Source</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {incomes.map((income) => (
                        <tr key={income._id}>
                            <td>{new Date(income.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
                            <td>{income.source}</td>
                            <td>${formatAmount(income.amount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IncomeGrid; 