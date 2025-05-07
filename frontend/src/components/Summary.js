import { useState, useEffect } from "react";
import axios from "axios";

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
        <div style={{ fontFamily }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h2 style={{
                    color: '#2c3e50',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    margin: 0
                }}>
                    {isYearlyView ? 'Yearly' : 'Monthly'} Summary - {isYearlyView ? year : `${month} ${year}`}
                </h2>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <button
                        onClick={() => handleYearChange(-1)}
                        style={{
                            padding: '0.5rem',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            background: 'white',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            color: '#495057'
                        }}
                    >
                        &lt;&lt;
                    </button>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'white',
                        padding: '0.5rem',
                        border: '1px solid #ced4da',
                        borderRadius: '4px'
                    }}>
                        <button
                            onClick={() => handleMonthIncrement(-1)}
                            style={{
                                padding: '0.25rem 0.5rem',
                                border: '1px solid #4a90e2',
                                borderRadius: '4px',
                                background: '#4a90e2',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '32px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#357abd';
                                e.currentTarget.style.borderColor = '#357abd';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#4a90e2';
                                e.currentTarget.style.borderColor = '#4a90e2';
                            }}
                        >
                            ←
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
                            style={{
                                padding: '0.25rem 0.5rem',
                                border: '1px solid #4a90e2',
                                borderRadius: '4px',
                                background: '#4a90e2',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '32px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#357abd';
                                e.currentTarget.style.borderColor = '#357abd';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#4a90e2';
                                e.currentTarget.style.borderColor = '#4a90e2';
                            }}
                        >
                            →
                        </button>
                        <span style={{
                            fontSize: '1rem',
                            color: '#495057',
                            fontWeight: '500',
                            paddingLeft: '0.5rem',
                            borderLeft: '1px solid #ced4da'
                        }}>
                            {year}
                        </span>
                    </div>
                    <button
                        onClick={() => handleYearChange(1)}
                        style={{
                            padding: '0.5rem',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            background: 'white',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            color: '#495057'
                        }}
                    >
                        &gt;&gt;
                    </button>
                    <button
                        onClick={handleTodayClick}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            background: isCurrentPeriod ? '#e9ecef' : 'white',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            color: '#495057',
                            fontWeight: '500'
                        }}
                    >
                        Today
                    </button>
                    <button
                        onClick={handleViewToggle}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #4a90e2',
                            borderRadius: '4px',
                            background: isYearlyView ? '#4a90e2' : 'white',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            color: isYearlyView ? 'white' : '#4a90e2',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            if (!isYearlyView) {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isYearlyView) {
                                e.currentTarget.style.backgroundColor = 'white';
                            }
                        }}
                    >
                        {isYearlyView ? 'Monthly View' : 'Yearly View'}
                    </button>
                </div>
            </div>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
            }}>
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#e9ecef',
                    borderRadius: '5px'
                }}>
                    <p style={{
                        color: '#495057',
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>Total Income</p>
                    <p style={{
                        color: '#2c3e50',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        margin: 0
                    }}>${data.totalIncome.toFixed(2)}</p>
                </div>

                <div style={{
                    padding: '1rem',
                    backgroundColor: '#e9ecef',
                    borderRadius: '5px'
                }}>
                    <p style={{
                        color: '#495057',
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>Maaser Owed</p>
                    <p style={{
                        color: '#2c3e50',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        margin: 0
                    }}>${data.maaser.toFixed(2)}</p>
                </div>

                <div style={{
                    padding: '1rem',
                    backgroundColor: '#e9ecef',
                    borderRadius: '5px'
                }}>
                    <p style={{
                        color: '#495057',
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>Total Tzedaka Given</p>
                    <p style={{
                        color: '#2c3e50',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        margin: 0
                    }}>${data.totalTzedaka.toFixed(2)}</p>
                </div>

                <div style={{
                    padding: '1rem',
                    backgroundColor: '#e9ecef',
                    borderRadius: '5px'
                }}>
                    <p style={{
                        color: '#495057',
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>Remaining Maaser</p>
                    <p style={{
                        color: '#2c3e50',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        margin: 0
                    }}>${data.balance.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default Summary;