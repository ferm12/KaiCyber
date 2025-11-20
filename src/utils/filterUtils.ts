/**
 * Filtering utilities for vulnerability data
 */

import { ProcessedVulnerability, FilterState } from '../types/vulnerability';

/**
 * Apply all filters to vulnerabilities
 * This is optimized for performance with large datasets
 */
export function applyFilters(
  vulnerabilities: ProcessedVulnerability[],
  filters: FilterState
): ProcessedVulnerability[] {
  let filtered = vulnerabilities;

  // Filter by kaiStatus exclusions (most selective, apply first)
  if (filters.excludeInvalidNorisk) {
    filtered = filtered.filter(
      (v) => v.kaiStatus !== 'invalid - norisk'
    );
  }

  if (filters.excludeAiInvalidNorisk) {
    filtered = filtered.filter(
      (v) => v.kaiStatus !== 'ai-invalid-norisk'
    );
  }

  // Filter by kaiStatus inclusion
  if (filters.kaiStatus.length > 0) {
    filtered = filtered.filter((v) =>
      filters.kaiStatus.includes(v.kaiStatus || 'unknown')
    );
  }

  // Filter by severity
  if (filters.severity.length > 0) {
    filtered = filtered.filter((v) => filters.severity.includes(v.severity));
  }

  // Filter by CVSS range
  filtered = filtered.filter(
    (v) => v.cvss >= filters.minCvss && v.cvss <= filters.maxCvss
  );

  // Filter by package name
  if (filters.packageName) {
    const packageLower = filters.packageName.toLowerCase();
    filtered = filtered.filter((v) =>
      v.packageName.toLowerCase().includes(packageLower)
    );
  }

  // Filter by CVE
  if (filters.cve) {
    const cveLower = filters.cve.toLowerCase();
    filtered = filtered.filter((v) =>
      v.cve.toLowerCase().includes(cveLower)
    );
  }

  // Filter by date range (comparing ISO strings)
  if (filters.dateRange.start) {
    filtered = filtered.filter((v) => {
      if (!v.publishedDate) return false;
      return v.publishedDate >= filters.dateRange.start!;
    });
  }

  if (filters.dateRange.end) {
    filtered = filtered.filter((v) => {
      if (!v.publishedDate) return false;
      return v.publishedDate <= filters.dateRange.end!;
    });
  }

  // Filter by search query (searches across multiple fields)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter((v) => {
      return (
        v.cve.toLowerCase().includes(query) ||
        v.packageName.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.severity.toLowerCase().includes(query) ||
        v.groupName.toLowerCase().includes(query) ||
        v.repoName.toLowerCase().includes(query)
      );
    });
  }

  return filtered;
}

/**
 * Sort vulnerabilities
 */
export function sortVulnerabilities(
  vulnerabilities: ProcessedVulnerability[],
  field: string,
  direction: 'asc' | 'desc'
): ProcessedVulnerability[] {
  const sorted = [...vulnerabilities];

  sorted.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (field) {
      case 'cvss':
        aValue = a.cvss;
        bValue = b.cvss;
        break;
      case 'severity':
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, unknown: 0 };
        aValue = severityOrder[a.severity] || 0;
        bValue = severityOrder[b.severity] || 0;
        break;
      case 'cve':
        aValue = a.cve;
        bValue = b.cve;
        break;
      case 'packageName':
        aValue = a.packageName;
        bValue = b.packageName;
        break;
      case 'published':
        // Compare ISO strings directly (they sort correctly)
        aValue = a.publishedDate || '';
        bValue = b.publishedDate || '';
        break;
      default:
        aValue = a[field as keyof ProcessedVulnerability];
        bValue = b[field as keyof ProcessedVulnerability];
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

/**
 * Get search suggestions based on query
 */
export function getSearchSuggestions(
  vulnerabilities: ProcessedVulnerability[],
  query: string,
  maxResults: number = 10
): string[] {
  if (!query || query.length < 2) return [];

  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();

  for (const vuln of vulnerabilities) {
    // CVE suggestions
    if (vuln.cve.toLowerCase().includes(queryLower)) {
      suggestions.add(vuln.cve);
      if (suggestions.size >= maxResults) break;
    }
  }

  if (suggestions.size < maxResults) {
    for (const vuln of vulnerabilities) {
      // Package name suggestions
      if (vuln.packageName.toLowerCase().includes(queryLower)) {
        suggestions.add(vuln.packageName);
        if (suggestions.size >= maxResults) break;
      }
    }
  }

  return Array.from(suggestions).slice(0, maxResults);
}

