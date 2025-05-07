import { useEffect, useState } from "react";
import axios from "axios";

import IncomeForm from "../components/IncomeForm";
import TzedakaForm from "../components/TzedakaForm";
import Summary from "../components/Summary";
import IncomeGrid from "../components/IncomeGrid";
import TzedakaGrid from "../components/TzedakaGrid";
import CombinedGrid from "../components/CombinedGrid";

import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"

const Dashboard = () => {
    const navigate = useNavigate();
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isYearlyView, setIsYearlyView] = useState(false);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    const fetchSummary = (date = selectedDate, yearly = isYearlyView) => {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        const endpoint = yearly 
            ? `http://localhost:5000/summary/yearly/${userId}?year=${year}`
            : `http://localhost:5000/summary/monthly/${userId}?month=${month}&year=${year}`;

        axios.get(endpoint, {
            headers: {
                Authorization: token,
            },
        })
            .then((response) => {
                setSummaryData(response.data || { 
                    totalIncome: 0, 
                    maaser: 0, 
                    totalTzedaka: 0, 
                    balance: 0,
                    monthlyBreakdown: [] 
                });
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

    const handleMonthChange = (newDate, yearly = isYearlyView) => {
        setSelectedDate(newDate);
        setIsYearlyView(yearly);
        fetchSummary(newDate, yearly);
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
            <div className="dashboard-header panel">
                <h1 className="dashboard-title">Dashboard</h1>
                <button onClick={handleLogout} className="submit-button logout-button">
                    Logout
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="grids-container">
                <div className="main-content">
                    {loading ? (
                        <div className="loading-container">
                            Loading...
                        </div>
                    ) : (
                        <Summary 
                            data={summaryData} 
                            onMonthChange={handleMonthChange}
                            isYearlyView={isYearlyView}
                        />
                    )}

                    {isYearlyView ? (
                        <CombinedGrid selectedDate={selectedDate} isYearlyView={isYearlyView} />
                    ) : (
                        <div className="forms-grid">
                            <IncomeGrid selectedDate={selectedDate} isYearlyView={isYearlyView} />
                            <TzedakaGrid selectedDate={selectedDate} isYearlyView={isYearlyView} />
                        </div>
                    )}
                </div>

                <div className="side-panels">
                    <div className="side-panel">
                        <IncomeForm onSuccess={() => fetchSummary()} />
                    </div>
                    <div className="side-panel">
                        <TzedakaForm onSuccess={() => fetchSummary()} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;