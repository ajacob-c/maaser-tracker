const Summary = ({ data }) => {
    const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    if (!data) return (
        <p style={{ 
            color: '#666',
            fontFamily,
            fontSize: '1rem'
        }}>
            No summary data available.
        </p>
    );

    return (
        <div style={{ fontFamily }}>
            <h2 style={{
                color: '#2c3e50',
                marginBottom: '1.5rem',
                fontSize: '1.5rem',
                fontWeight: '600'
            }}>Monthly Summary</h2>
            
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
                    }}>${data.totalIncome}</p>
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
                    }}>${data.maaser}</p>
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
                    }}>${data.totalTzedaka}</p>
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
                    }}>${data.balance}</p>
                </div>
            </div>
        </div>
    );
};

export default Summary;