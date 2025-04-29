import { useEffect, useState } from "react";
import axios from "axios";

import IncomeForm from "../components/IncomeForm";
import TzedakaForm from "../components/TzedakaForm";
import Summary from "../components/Summary";
import ChartComponent from "../components/ChartComponent";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const fetchSummary = () => {
        axios.get(`http://localhost:5000/summary/monthly/${userId}`, {
            headers: {
                Authorization: token,
            },
        })
            .then((response) => {
                setSummaryData(response.data || { totalIncome: 0, maaser: 0, totalTzedaka: 0, balance: 0 });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching summary:", error);
                setError("Failed to fetch summary. Please try again later.");
                setLoading(false);

                if (error.response && error.response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    navigate("/login");
                }
            });
    };

    useEffect(() => {
        if (!token || !userId) {
            navigate("/login");
            return;
        }
        fetchSummary();
    }, [navigate, token, userId]);


    if (loading) return <p>Loading dashboard...</p>;
    if (error && !summaryData) return <p>{error}</p>;

    return (
        <div>
            <h1>Dashboard</h1>
            {/* Forms to Insert Data */}
            <IncomeForm onSuccess={fetchSummary} />
            <TzedakaForm onSuccess={fetchSummary} />

            {/* Summary Data */}
            <Summary data={summaryData} />

            {/* Chart */}
            <ChartComponent data={summaryData} />

            {/* Logout */}
            <button onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                navigate("/login");
            }}>Logout</button>
        </div>
    );
};

export default Dashboard;