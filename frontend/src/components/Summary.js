
const Summary = () => ({data}) => {
    if (!data) return <p>No summary data available.</p>;

    return(
        <div>
            <h2>Monthly Summary</h2>
            <p>Total Income: ${data.totalIncome}</p>
            <p>Maaaser Owed: ${data.maaser}</p>
            <p>Total Tzedaka Given: ${data.totalTzedaka}</p>
            <p>Remaining Maaser: ${data.balance}</p>
        </div>
    );
};

export default Summary;