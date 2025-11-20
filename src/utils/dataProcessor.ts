/**
 * Data processing utilities for vulnerability data
 */

import { VulnerabilityData, ProcessedVulnerability } from '../types/vulnerability';

/**
 * Process raw vulnerability data into a flat array of processed vulnerabilities
 * This creates efficient data structures for filtering and querying
 */
export function processVulnerabilityData(data: VulnerabilityData): ProcessedVulnerability[] {
  const processed: ProcessedVulnerability[] = [];
  let idCounter = 0;

  // Iterate through groups, repos, images, and vulnerabilities
  for (const [, group] of Object.entries(data.groups)) {
    for (const [, repo] of Object.entries(group.repos)) {
      for (const [, image] of Object.entries(repo.images)) {
        for (const vulnerability of image.vulnerabilities) {
          const processedVuln: ProcessedVulnerability = {
            ...vulnerability,
            id: `vuln-${idCounter++}`,
            groupName: group.name,
            repoName: repo.name,
            imageName: image.name,
            imageVersion: image.version,
            publishedDate: parseDate(vulnerability.published),
            fixDateParsed: parseDate(vulnerability.fixDate),
          };
          processed.push(processedVuln);
        }
      }
    }
  }

  return processed;
}

/**
 * Parse date string to ISO string (for Redux serialization)
 * Returns ISO string or null
 */
function parseDate(dateString: string): string | null {
  if (!dateString || dateString === '1970-01-01 00:00:00') {
    return null;
  }
  try {
    // Handle format: "2024-04-16 06:30:28"
    const date = new Date(dateString.replace(' ', 'T'));
    return isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
}

/**
 * Convert ISO string to Date object (for use in components)
 */
export function parseDateString(isoString: string | null): Date | null {
  if (!isoString) return null;
  try {
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Create an index map for fast lookups
 */
export function createIndexMap(vulnerabilities: ProcessedVulnerability[]) {
  const indices = {
    byCve: new Map<string, ProcessedVulnerability[]>(),
    byPackage: new Map<string, ProcessedVulnerability[]>(),
    bySeverity: new Map<string, ProcessedVulnerability[]>(),
    byKaiStatus: new Map<string, ProcessedVulnerability[]>(),
    byGroup: new Map<string, ProcessedVulnerability[]>(),
    byRepo: new Map<string, ProcessedVulnerability[]>(),
  };

  for (const vuln of vulnerabilities) {
    // Index by CVE
    if (!indices.byCve.has(vuln.cve)) {
      indices.byCve.set(vuln.cve, []);
    }
    indices.byCve.get(vuln.cve)!.push(vuln);

    // Index by package name
    if (!indices.byPackage.has(vuln.packageName)) {
      indices.byPackage.set(vuln.packageName, []);
    }
    indices.byPackage.get(vuln.packageName)!.push(vuln);

    // Index by severity
    if (!indices.bySeverity.has(vuln.severity)) {
      indices.bySeverity.set(vuln.severity, []);
    }
    indices.bySeverity.get(vuln.severity)!.push(vuln);

    // Index by kaiStatus
    const kaiStatus = vuln.kaiStatus || 'unknown';
    if (!indices.byKaiStatus.has(kaiStatus)) {
      indices.byKaiStatus.set(kaiStatus, []);
    }
    indices.byKaiStatus.get(kaiStatus)!.push(vuln);

    // Index by group
    if (!indices.byGroup.has(vuln.groupName)) {
      indices.byGroup.set(vuln.groupName, []);
    }
    indices.byGroup.get(vuln.groupName)!.push(vuln);

    // Index by repo
    if (!indices.byRepo.has(vuln.repoName)) {
      indices.byRepo.set(vuln.repoName, []);
    }
    indices.byRepo.get(vuln.repoName)!.push(vuln);
  }

  return indices;
}

/**
 * Get unique values for filtering
 */
export function getUniqueValues(
  vulnerabilities: ProcessedVulnerability[],
  field: keyof ProcessedVulnerability
): string[] {
  const values = new Set<string>();
  for (const vuln of vulnerabilities) {
    const value = vuln[field];
    if (value !== null && value !== undefined && value !== '') {
      values.add(String(value));
    }
  }
  return Array.from(values).sort();
}

