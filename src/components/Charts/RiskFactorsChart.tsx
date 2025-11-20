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
import { getRiskFactorsFrequencyData } from '../../utils/chartUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function RiskFactorsChart() {
  const vulnerabilities = useAppSelector(
    (state) => state.vulnerabilities.filteredVulnerabilities
  );

  const chartData = useMemo(
    () => getRiskFactorsFrequencyData(vulnerabilities),
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
            return `Frequency: ${context.parsed.y.toLocaleString()}`;
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
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default RiskFactorsChart;

