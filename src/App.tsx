import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { loadVulnerabilityData } from './store/slices/vulnerabilitiesSlice';
import Layout from './components/Layout/Layout';

// Lazy load components for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const VulnerabilityList = lazy(() => import('./pages/VulnerabilityList'));
const VulnerabilityDetail = lazy(() => import('./pages/VulnerabilityDetail'));
const Comparison = lazy(() => import('./pages/Comparison'));

function App() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.vulnerabilities);

  useEffect(() => {
    // Load data on mount
    dispatch(loadVulnerabilityData('/ui_demo.json'));
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <h2>Error loading data</h2>
        <p>{error}</p>
      </Box>
    );
  }

  return (
    <Layout>
      <Suspense
        fallback={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vulnerabilities" element={<VulnerabilityList />} />
          <Route path="/vulnerabilities/:id" element={<VulnerabilityDetail />} />
          <Route path="/comparison" element={<Comparison />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;

