import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Grid.css";
import { formatAmount } from "../utils/format";

const CombinedGrid = ({ selectedDate, isYearlyView }) => {
    const [incomes, setIncomes] = useState([]);
    const [tzedakas, setTzedakas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");
                const year = selectedDate.getFullYear();
                
                // Fetch both income and tzedaka data
                const [incomeResponse, tzedakaResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/income/user/${userId}?year=${year}`, {
                        headers: { Authorization: token }
                    }),
                    axios.get(`http://localhost:5000/tzedaka/user/${userId}?year=${year}`, {
                        headers: { Authorization: token }
                    })
                ]);
                
                setIncomes(incomeResponse.data);
                setTzedakas(tzedakaResponse.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data");
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDate, isYearlyView]);

    if (loading) return <div className="loading">Loading data...</div>;
    if (error) return <div className="error">{error}</div>;

    if (isYearlyView) {
        // Group data by month
        const monthlyData = Array(12).fill().map((_, monthIndex) => {
            const monthIncomes = incomes.filter(income => {
                const date = new Date(income.date);
                return date.getUTCMonth() === monthIndex && date.getUTCFullYear() === selectedDate.getFullYear();
            });

            const monthTzedakas = tzedakas.filter(tzedaka => {
                const date = new Date(tzedaka.date);
                return date.getUTCMonth() === monthIndex && date.getUTCFullYear() === selectedDate.getFullYear();
            });

            const totalIncome = monthIncomes.reduce((sum, income) => sum + income.amount, 0);
            const totalTzedaka = monthTzedakas.reduce((sum, tzedaka) => sum + tzedaka.amount, 0);
            const monthName = new Date(Date.UTC(selectedDate.getFullYear(), monthIndex, 1))
                .toLocaleString('default', { month: 'long', timeZone: 'UTC' });

            return {
                month: monthName,
                incomes: monthIncomes,
                tzedakas: monthTzedakas,
                totalIncome,
                totalTzedaka
            };
        });

        return (
            <div className="grid-container">
                <h2>Monthly Details - {selectedDate.getFullYear()}</h2>
                <table className="data-grid">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Total Income</th>
                            <th>Income Details</th>
                            <th>Total Tzedaka</th>
                            <th>Tzedaka Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyData.map((monthData, index) => (
                            <tr key={index} className="yearly-row">
                                <td>{monthData.month}</td>
                                <td>${formatAmount(monthData.totalIncome)}</td>
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
                                                        <td>{new Date(income.date).toLocaleString('default', { 
                                                            year: 'numeric',
                                                            month: 'numeric',
                                                            day: 'numeric',
                                                            timeZone: 'UTC'
                                                        })}</td>
                                                        <td>{income.source}</td>
                                                        <td>${formatAmount(income.amount)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </td>
                                <td>${formatAmount(monthData.totalTzedaka)}</td>
                                <td className="details-cell">
                                    {monthData.tzedakas.length > 0 && (
                                        <table className="nested-table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Organization</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {monthData.tzedakas.map((tzedaka) => (
                                                    <tr key={tzedaka._id}>
                                                        <td>{new Date(tzedaka.date).toLocaleString('default', { 
                                                            year: 'numeric',
                                                            month: 'numeric',
                                                            day: 'numeric',
                                                            timeZone: 'UTC'
                                                        })}</td>
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

    return null; // Monthly view not implemented in combined grid
};

export default CombinedGrid; 