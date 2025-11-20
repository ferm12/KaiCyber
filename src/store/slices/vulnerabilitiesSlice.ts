import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProcessedVulnerability, VulnerabilityData, DashboardMetrics } from '../../types/vulnerability';
import { processVulnerabilityData } from '../../utils/dataProcessor';

interface VulnerabilitiesState {
  rawData: VulnerabilityData | null;
  processedVulnerabilities: ProcessedVulnerability[];
  filteredVulnerabilities: ProcessedVulnerability[];
  metrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: VulnerabilitiesState = {
  rawData: null,
  processedVulnerabilities: [],
  filteredVulnerabilities: [],
  metrics: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async thunk for loading data
export const loadVulnerabilityData = createAsyncThunk(
  'vulnerabilities/loadData',
  async (filePath: string) => {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error('Failed to load vulnerability data');
    }
    const data: VulnerabilityData = await response.json();
    return data;
  }
);

const vulnerabilitiesSlice = createSlice({
  name: 'vulnerabilities',
  initialState,
  reducers: {
    setFilteredVulnerabilities: (state, action: PayloadAction<ProcessedVulnerability[]>) => {
      state.filteredVulnerabilities = action.payload;
    },
    updateMetrics: (state, action: PayloadAction<ProcessedVulnerability[]>) => {
      const vulns = action.payload;
      const metrics: DashboardMetrics = {
        totalVulnerabilities: vulns.length,
        criticalCount: vulns.filter(v => v.severity === 'critical').length,
        highCount: vulns.filter(v => v.severity === 'high').length,
        mediumCount: vulns.filter(v => v.severity === 'medium').length,
        lowCount: vulns.filter(v => v.severity === 'low').length,
        averageCvss: vulns.length > 0 
          ? vulns.reduce((sum, v) => sum + v.cvss, 0) / vulns.length 
          : 0,
        vulnerabilitiesWithFix: vulns.filter(v => v.status.toLowerCase().includes('fixed')).length,
        uniquePackages: new Set(vulns.map(v => v.packageName)).size,
        uniqueCves: new Set(vulns.map(v => v.cve)).size,
      };
      state.metrics = metrics;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadVulnerabilityData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadVulnerabilityData.fulfilled, (state, action) => {
        state.loading = false;
        state.rawData = action.payload;
        const processed = processVulnerabilityData(action.payload);
        state.processedVulnerabilities = processed;
        state.filteredVulnerabilities = processed;
        // Calculate initial metrics
        const metrics: DashboardMetrics = {
          totalVulnerabilities: processed.length,
          criticalCount: processed.filter(v => v.severity === 'critical').length,
          highCount: processed.filter(v => v.severity === 'high').length,
          mediumCount: processed.filter(v => v.severity === 'medium').length,
          lowCount: processed.filter(v => v.severity === 'low').length,
          averageCvss: processed.length > 0 
            ? processed.reduce((sum, v) => sum + v.cvss, 0) / processed.length 
            : 0,
          vulnerabilitiesWithFix: processed.filter(v => v.status.toLowerCase().includes('fixed')).length,
          uniquePackages: new Set(processed.map(v => v.packageName)).size,
          uniqueCves: new Set(processed.map(v => v.cve)).size,
        };
        state.metrics = metrics;
        state.lastUpdated = Date.now();
      })
      .addCase(loadVulnerabilityData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load data';
      });
  },
});

export const { setFilteredVulnerabilities, updateMetrics } = vulnerabilitiesSlice.actions;
export default vulnerabilitiesSlice.reducer;

