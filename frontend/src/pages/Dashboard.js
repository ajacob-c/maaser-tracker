import { useEffect, useState } from "react";
import axios from "axios";

import IncomeForm from "../components/IncomeForm";
import TzedakaForm from "../components/TzedakaForm";
import Summary from "../components/Summary";
import ChartComponent from "../components/ChartComponent";

import { useNavigate } from "react-router-dom";
import "./Dashboard.css"

const Dashboard = () => {
    const navigate = useNavigate();
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    const fetchSummary = () => {
        axios.get(`http://localhost:5000/summary/monthly/${userId}`, {
            headers: {
                Authorization: token,
            },
        })
            .then((response) => {
                setSummaryData(response.data || { totalIncome: 0, maaser: 0, totalTzedaka: 0, balance: 0 });
                setLoading(false);
                setError(""); // Clear any previous errors
            })
            .catch((error) => {
                console.error("Error fetching summary:", error);
                
                // Handle token expiration specifically
                if (error.response?.data?.code === "TOKEN_EXPIRED") {
                    setError("Your session has expired. Please log in again.");
                    handleLogout();
                    return;
                }

                // Handle other authentication errors
                if (error.response?.status === 401) {
                    setError("Authentication error. Please log in again.");
                    handleLogout();
                    return;
                }

                setError("Failed to fetch summary. Please try again later.");
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!token || !userId) {
            navigate("/login");
            return;
        }
        fetchSummary();
    }, [navigate, token, userId]);

    if (loading) return (
        <div className="loading-container">
            Loading dashboard...
        </div>
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <button 
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Logout
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="forms-grid">
                <div className="form-card">
                    <IncomeForm onSuccess={fetchSummary} />
                </div>
                <div className="form-card">
                    <TzedakaForm onSuccess={fetchSummary} />
                </div>
            </div>

            <div className="form-card">
                <Summary data={summaryData} />
            </div>

            <div className="form-card">
                <ChartComponent data={summaryData} />
            </div>
        </div>
    );
};

export default Dashboard;