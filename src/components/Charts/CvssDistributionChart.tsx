import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAppSelector } from '../../store/hooks';
import { getCvssDistributionData } from '../../utils/chartUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CvssDistributionChart() {
  const vulnerabilities = useAppSelector(
    (state) => state.vulnerabilities.filteredVulnerabilities
  );

  const chartData = useMemo(
    () => getCvssDistributionData(vulnerabilities),
    [vulnerabilities]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
            return `Count: ${context.parsed.y.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default CvssDistributionChart;

