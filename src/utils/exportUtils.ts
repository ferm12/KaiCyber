/**
 * Export utilities for vulnerability data
 */

import { ProcessedVulnerability } from '../types/vulnerability';

/**
 * Export vulnerabilities to CSV format
 */
export function exportToCSV(
  vulnerabilities: ProcessedVulnerability[],
  filename: string = 'vulnerabilities'
): void {
  if (vulnerabilities.length === 0) {
    alert('No data to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'CVE',
    'Severity',
    'CVSS',
    'Package Name',
    'Package Version',
    'Status',
    'Kai Status',
    'Description',
    'Published',
    'Fix Date',
    'Link',
    'Group',
    'Repo',
    'Image',
  ];

  // Convert vulnerabilities to CSV rows
  const rows = vulnerabilities.map((v) => [
    v.cve,
    v.severity,
    v.cvss.toString(),
    v.packageName,
    v.packageVersion,
    v.status,
    v.kaiStatus || '',
    `"${v.description.replace(/"/g, '""')}"`, // Escape quotes in description
    v.published,
    v.fixDate,
    v.link,
    v.groupName,
    v.repoName,
    v.imageName,
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export vulnerabilities to JSON format
 */
export function exportToJSON(
  vulnerabilities: ProcessedVulnerability[],
  filename: string = 'vulnerabilities'
): void {
  if (vulnerabilities.length === 0) {
    alert('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(vulnerabilities, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

