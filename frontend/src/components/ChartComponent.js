import { Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  // 🧠 Register necessary components manually
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const ChartComponent = ({ data }) => {
    if (!data) return <p>No chart data available.</p>;

    const chartData = {
        labels: ["Total Income", "Maaser Owed", "Tzedaka Given"],
        datasets: [
            {
                label: "Monthly Financials",
                data: [data.totalIncome, data.maaser, data.totalTzedaka],
                backgroundColor: ["blue", "green", "red"],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Monthly Financial Overview" },
        },
      };
    
      return <Bar data={chartData} options={options} />;
};

export default ChartComponent;