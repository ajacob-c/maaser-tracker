import { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Summary.css';
import { formatAmount } from "../utils/format";

const Summary = ({ data, onMonthChange }) => {
    const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isYearlyView, setIsYearlyView] = useState(false);

    const handleMonthChange = (e) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(parseInt(e.target.value));
        setSelectedDate(newDate);
        onMonthChange(newDate, isYearlyView);
    };

    const handleYearChange = (increment) => {
        const newDate = new Date(selectedDate);
        newDate.setFullYear(newDate.getFullYear() + increment);
        setSelectedDate(newDate);
        onMonthChange(newDate, isYearlyView);
    };

    const handleMonthIncrement = (increment) => {
        const newDate = new Date(selectedDate);
        if (isYearlyView) {
            newDate.setFullYear(newDate.getFullYear() + increment);
        } else {
            newDate.setMonth(newDate.getMonth() + increment);
        }
        setSelectedDate(newDate);
        onMonthChange(newDate, isYearlyView);
    };

    const handleTodayClick = () => {
        const today = new Date();
        setSelectedDate(today);
        onMonthChange(today, isYearlyView);
    };

    const handleViewToggle = () => {
        const newIsYearlyView = !isYearlyView;
        setIsYearlyView(newIsYearlyView);
        onMonthChange(selectedDate, newIsYearlyView);
    };

    // Update selectedDate when data changes
    useEffect(() => {
        if (data && data.date) {
            setSelectedDate(new Date(data.date));
        }
    }, [data]);

    if (!data) return (
        <p style={{ 
            color: '#666',
            fontFamily,
            fontSize: '1rem'
        }}>
            No summary data available.
        </p>
    );

    const month = selectedDate.toLocaleString('default', { month: 'long' });
    const year = selectedDate.getFullYear();
    const isCurrentPeriod = isYearlyView 
        ? selectedDate.getFullYear() === new Date().getFullYear()
        : selectedDate.getMonth() === new Date().getMonth() && 
          selectedDate.getFullYear() === new Date().getFullYear();

    return (
        <div className="summary-container" style={{ fontFamily }}>
            <div className="summary-header">
                <h2 style={{
                    color: '#2c3e50',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    margin: 0
                }}>
                    {isYearlyView ? 'Yearly' : 'Monthly'} Summary - {isYearlyView ? year : `${month} ${year}`}
                </h2>
                
                <div className="date-navigation">
                    <button 
                        onClick={() => handleYearChange(-1)}
                        className="nav-button year-button"
                    >
                        &lt;&lt;
                    </button>
                    <div className="date-display">
                        <button
                            onClick={() => handleMonthIncrement(-1)}
                            className="nav-button year-button"
                            style={{ display: isYearlyView ? 'none' : 'block' }}
                        >
                            &lt;
                        </button>
                        {!isYearlyView && (
                            <select
                                value={selectedDate.getMonth()}
                                onChange={handleMonthChange}
                                style={{
                                    border: 'none',
                                    fontSize: '1rem',
                                    color: '#495057',
                                    background: 'white',
                                    cursor: 'pointer',
                                    padding: '0 0.5rem'
                                }}
                            >
                                <option value="0">January</option>
                                <option value="1">February</option>
                                <option value="2">March</option>
                                <option value="3">April</option>
                                <option value="4">May</option>
                                <option value="5">June</option>
                                <option value="6">July</option>
                                <option value="7">August</option>
                                <option value="8">September</option>
                                <option value="9">October</option>
                                <option value="10">November</option>
                                <option value="11">December</option>
                            </select>
                        )}
                        <button
                            onClick={() => handleMonthIncrement(1)}
                            className="nav-button year-button"
                            style={{ display: isYearlyView ? 'none' : 'block' }}
                        >
                            &gt;
                        </button>
                        <span style={{
                            fontSize: '1rem',
                            color: '#495057',
                            fontWeight: '500',
                            paddingLeft: isYearlyView ? '0' : '0.5rem',
                            borderLeft: isYearlyView ? 'none' : '1px solid #ced4da'
                        }}>
                            {selectedDate.getFullYear()}
                        </span>
                    </div>
                    <button
                        onClick={() => handleYearChange(1)}
                        className="nav-button year-button"
                    >
                        &gt;&gt;
                    </button>
                    <button
                        onClick={handleTodayClick}
                        className="today-button"
                    >
                        Today
                    </button>
                    <button
                        onClick={handleViewToggle}
                        className={`toggle-button ${isYearlyView ? 'active' : ''}`}
                    >
                        {isYearlyView ? 'Monthly View' : 'Yearly View'}
                    </button>
                </div>
            </div>
            
            <div className="summary-grid">
                <div className="summary-item">
                    <h3>Total Income</h3>
                    <p>${formatAmount(data.totalIncome || 0)}</p>
                </div>

                <div className="summary-item">
                    <h3>Maaser Owed</h3>
                    <p>${formatAmount(data.maaser || 0)}</p>
                </div>

                <div className="summary-item">
                    <h3>Net Income</h3>
                    <p>${formatAmount(data.netIncome || 0)}</p>
                </div>

                <div className="summary-item">
                    <h3>Total Tzedaka Given</h3>
                    <p>${formatAmount(data.totalTzedaka || 0)}</p>
                </div>

                <div className="summary-item">
                    <h3>Remaining Maaser</h3>
                    <p>${formatAmount(data.balance || 0)}</p>
                </div>
            </div>

            {isYearlyView && data.monthlyBreakdown && (
                <div className="monthly-breakdown">
                    <h3>Monthly Breakdown - {selectedDate.getFullYear()}</h3>
                    <table className="breakdown-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Income</th>
                                <th>Maaser</th>
                                <th>Tzedaka</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.monthlyBreakdown.map((month) => (
                                <tr key={month.month}>
                                    <td>{month.monthName}</td>
                                    <td>${formatAmount(month.income)}</td>
                                    <td>${formatAmount(month.maaser)}</td>
                                    <td>${formatAmount(month.tzedaka)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Summary;