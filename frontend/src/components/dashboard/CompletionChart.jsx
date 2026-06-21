import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CompletionChart({ data }) {
  const { isDark } = useTheme();

  // Build last 7 days labels
  const labels = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), 'MMM d')
  );

  // Map API data to labels
  const counts = labels.map((label) => {
    const found = data.find((d) => {
      const dateStr = format(new Date(d.date), 'MMM d');
      return dateStr === label;
    });
    return found ? parseInt(found.count) : 0;
  });

  const chartData = {
    labels,
    datasets: [{
      label: 'Tasks Created',
      data: counts,
      backgroundColor: isDark ? 'rgba(96, 165, 250, 0.7)' : 'rgba(37, 99, 235, 0.7)',
      borderColor: isDark ? '#60a5fa' : '#2563eb',
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => ` ${item.parsed.y} tasks`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: isDark ? '#9ca3af' : '#6b7280', font: { size: 11 } },
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
      },
    },
  };

  return (
    <div className="h-56">
      {counts.every((c) => c === 0) ? (
        <div className="h-full flex items-center justify-center text-sm text-gray-400">
          No activity in the last 7 days
        </div>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}
