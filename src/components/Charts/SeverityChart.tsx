import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAppSelector } from '../../store/hooks';
import { getSeverityDistributionData } from '../../utils/chartUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

function SeverityChart() {
  const vulnerabilities = useAppSelector(
    (state) => state.vulnerabilities.filteredVulnerabilities
  );

  const chartData = useMemo(
    () => getSeverityDistributionData(vulnerabilities),
    [vulnerabilities]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}

export default SeverityChart;

