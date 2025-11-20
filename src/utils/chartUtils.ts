/**
 * Chart data preparation utilities
 */

import { ProcessedVulnerability, ChartData } from '../types/vulnerability';

/**
 * Generate severity distribution chart data
 */
export function getSeverityDistributionData(
  vulnerabilities: ProcessedVulnerability[]
): ChartData {
  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    unknown: 0,
  };

  for (const vuln of vulnerabilities) {
    counts[vuln.severity] = (counts[vuln.severity] || 0) + 1;
  }

  return {
    labels: ['Critical', 'High', 'Medium', 'Low', 'Unknown'],
    datasets: [
      {
        label: 'Vulnerabilities by Severity',
        data: [
          counts.critical,
          counts.high,
          counts.medium,
          counts.low,
          counts.unknown,
        ],
        backgroundColor: [
          'rgba(220, 38, 38, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(250, 204, 21, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgba(220, 38, 38, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(250, 204, 21, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
}

/**
 * Generate risk factors frequency chart data
 */
export function getRiskFactorsFrequencyData(
  vulnerabilities: ProcessedVulnerability[]
): ChartData {
  const riskFactorCounts = new Map<string, number>();

  for (const vuln of vulnerabilities) {
    for (const riskFactor of Object.keys(vuln.riskFactors)) {
      riskFactorCounts.set(
        riskFactor,
        (riskFactorCounts.get(riskFactor) || 0) + 1
      );
    }
  }

  // Sort by frequency and take top 10
  const sorted = Array.from(riskFactorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return {
    labels: sorted.map(([label]) => label),
    datasets: [
      {
        label: 'Frequency',
        data: sorted.map(([, count]) => count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };
}

/**
 * Generate trend analysis data (vulnerabilities over time)
 */
export function getTrendAnalysisData(
  vulnerabilities: ProcessedVulnerability[]
): ChartData {
  const monthlyCounts = new Map<string, number>();

  for (const vuln of vulnerabilities) {
    if (vuln.publishedDate) {
      // Parse ISO string to Date for month extraction
      const date = new Date(vuln.publishedDate);
      if (!isNaN(date.getTime())) {
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`;
        monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) || 0) + 1);
      }
    }
  }

  // Sort by date
  const sorted = Array.from(monthlyCounts.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return {
    labels: sorted.map(([date]) => date),
    datasets: [
      {
        label: 'Vulnerabilities Published',
        data: sorted.map(([, count]) => count),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

/**
 * Generate CVSS score distribution
 */
export function getCvssDistributionData(
  vulnerabilities: ProcessedVulnerability[]
): ChartData {
  const bins = {
    '0-2': 0,
    '2-4': 0,
    '4-6': 0,
    '6-8': 0,
    '8-10': 0,
  };

  for (const vuln of vulnerabilities) {
    const cvss = vuln.cvss;
    if (cvss < 2) bins['0-2']++;
    else if (cvss < 4) bins['2-4']++;
    else if (cvss < 6) bins['4-6']++;
    else if (cvss < 8) bins['6-8']++;
    else bins['8-10']++;
  }

  return {
    labels: Object.keys(bins),
    datasets: [
      {
        label: 'CVSS Score Distribution',
        data: Object.values(bins),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(250, 204, 21, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(220, 38, 38, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(250, 204, 21, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(220, 38, 38, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
}

/**
 * Generate AI vs Manual analysis comparison data
 */
export function getAiVsManualData(
  vulnerabilities: ProcessedVulnerability[]
): ChartData {
  const counts = {
    aiInvalid: 0,
    aiValid: 0,
    manualInvalid: 0,
    manualValid: 0,
    unknown: 0,
  };

  for (const vuln of vulnerabilities) {
    const status = vuln.kaiStatus || 'unknown';
    if (status === 'ai-invalid-norisk') counts.aiInvalid++;
    else if (status === 'ai-valid' || status.startsWith('ai-')) counts.aiValid++;
    else if (status === 'invalid - norisk') counts.manualInvalid++;
    else if (status === 'valid') counts.manualValid++;
    else counts.unknown++;
  }

  return {
    labels: ['AI Invalid', 'AI Valid', 'Manual Invalid', 'Manual Valid', 'Unknown'],
    datasets: [
      {
        label: 'Analysis Results',
        data: [
          counts.aiInvalid,
          counts.aiValid,
          counts.manualInvalid,
          counts.manualValid,
          counts.unknown,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
}

