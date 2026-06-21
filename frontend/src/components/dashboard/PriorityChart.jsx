import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PriorityChart({ data }) {
  const { low = 0, medium = 0, high = 0 } = data;
  const total = low + medium + high;

  const chartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      data: [low, medium, high],
      backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
      borderColor: ['#16a34a', '#d97706', '#dc2626'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 16,
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: (item) => {
            const pct = total ? Math.round((item.parsed / total) * 100) : 0;
            return ` ${item.label}: ${item.parsed} (${pct}%)`;
          },
        },
      },
    },
  };

  if (total === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-sm text-gray-400">
        No tasks to display
      </div>
    );
  }

  return (
    <div className="h-56 relative">
      <Doughnut data={chartData} options={options} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
      </div>
    </div>
  );
}
