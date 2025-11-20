import { useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Fade,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  applyAnalysisFilter,
  applyAiAnalysisFilter,
  resetFilters,
} from '../store/slices/filtersSlice';
import {
  setFilteredVulnerabilities,
  updateMetrics,
} from '../store/slices/vulnerabilitiesSlice';
import { applyFilters } from '../utils/filterUtils';
import MetricsCard from '../components/Dashboard/MetricsCard';
import SeverityChart from '../components/Charts/SeverityChart';
import RiskFactorsChart from '../components/Charts/RiskFactorsChart';
import TrendChart from '../components/Charts/TrendChart';
import CvssDistributionChart from '../components/Charts/CvssDistributionChart';
import AiVsManualChart from '../components/Charts/AiVsManualChart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RefreshIcon from '@mui/icons-material/Refresh';

function Dashboard() {
  const dispatch = useAppDispatch();
  const { processedVulnerabilities, metrics } = useAppSelector(
    (state) => state.vulnerabilities
  );
  const filters = useAppSelector((state) => state.filters);

  // Apply filters and update metrics
  useEffect(() => {
    const filtered = applyFilters(processedVulnerabilities, filters);
    dispatch(setFilteredVulnerabilities(filtered));
    dispatch(updateMetrics(filtered));
  }, [processedVulnerabilities, filters, dispatch]);

  const filteredCount = useAppSelector(
    (state) => state.vulnerabilities.filteredVulnerabilities.length
  );

  const handleAnalysisClick = () => {
    dispatch(applyAnalysisFilter());
  };

  const handleAiAnalysisClick = () => {
    dispatch(applyAiAnalysisFilter());
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const isFilterActive =
    filters.excludeInvalidNorisk || filters.excludeAiInvalidNorisk;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Security Vulnerability Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AnalyticsIcon />}
            onClick={handleAnalysisClick}
            sx={{
              background: filters.excludeInvalidNorisk
                ? 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
                : undefined,
              boxShadow: filters.excludeInvalidNorisk ? 4 : 1,
              transform: filters.excludeInvalidNorisk ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          >
            Analysis
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SmartToyIcon />}
            onClick={handleAiAnalysisClick}
            sx={{
              background: filters.excludeAiInvalidNorisk
                ? 'linear-gradient(45deg, #dc004e 30%, #ff5983 90%)'
                : undefined,
              boxShadow: filters.excludeAiInvalidNorisk ? 4 : 1,
              transform: filters.excludeAiInvalidNorisk ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          >
            AI Analysis
          </Button>
          {isFilterActive && (
            <Fade in={isFilterActive}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </Fade>
          )}
        </Box>
      </Box>

      {/* Filter Status Indicator */}
      {isFilterActive && (
        <Fade in={isFilterActive}>
          <Paper
            sx={{
              p: 2,
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">
                Filters Active: Showing {filteredCount.toLocaleString()} of{' '}
                {processedVulnerabilities.length.toLocaleString()} vulnerabilities
              </Typography>
              {filters.excludeInvalidNorisk && (
                <Chip
                  label="Excluding: invalid - norisk"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                />
              )}
              {filters.excludeAiInvalidNorisk && (
                <Chip
                  label="Excluding: ai-invalid-norisk"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                />
              )}
            </Box>
          </Paper>
        </Fade>
      )}

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <MetricsCard
                title="Total Vulnerabilities"
                value={metrics.totalVulnerabilities.toLocaleString()}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricsCard
                title="Critical"
                value={metrics.criticalCount.toLocaleString()}
                color="#d32f2f"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricsCard
                title="High"
                value={metrics.highCount.toLocaleString()}
                color="#ed6c02"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricsCard
                title="Average CVSS"
                value={metrics.averageCvss.toFixed(2)}
                color="#0288d1"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Severity Distribution
            </Typography>
            <SeverityChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              CVSS Score Distribution
            </Typography>
            <CvssDistributionChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Risk Factors Frequency
            </Typography>
            <RiskFactorsChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              AI vs Manual Analysis
            </Typography>
            <AiVsManualChart />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vulnerability Trends Over Time
            </Typography>
            <TrendChart />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;

