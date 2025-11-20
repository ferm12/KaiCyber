import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  Autocomplete,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector } from '../store/hooks';
import { ProcessedVulnerability } from '../types/vulnerability';

function Comparison() {
  const { filteredVulnerabilities } = useAppSelector(
    (state) => state.vulnerabilities
  );
  const { selectedVulnerabilities } = useAppSelector((state) => state.ui);

  const [selectedIds, setSelectedIds] = useState<string[]>(
    selectedVulnerabilities.slice(0, 5) // Limit to 5 for comparison
  );

  const selectedVulns = filteredVulnerabilities.filter((v) =>
    selectedIds.includes(v.id)
  );

  const handleRemove = (id: string) => {
    setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const comparisonFields = [
    { label: 'CVE', field: 'cve' as keyof ProcessedVulnerability },
    { label: 'Severity', field: 'severity' as keyof ProcessedVulnerability },
    { label: 'CVSS', field: 'cvss' as keyof ProcessedVulnerability },
    {
      label: 'Package Name',
      field: 'packageName' as keyof ProcessedVulnerability,
    },
    {
      label: 'Package Version',
      field: 'packageVersion' as keyof ProcessedVulnerability,
    },
    { label: 'Status', field: 'status' as keyof ProcessedVulnerability },
    { label: 'Kai Status', field: 'kaiStatus' as keyof ProcessedVulnerability },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Vulnerability Comparison
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Vulnerabilities to Compare
        </Typography>
        <Autocomplete
          multiple
          options={filteredVulnerabilities}
          getOptionLabel={(option) => `${option.cve} - ${option.packageName}`}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          value={selectedVulns}
          onChange={(_, newValue) => {
            setSelectedIds(newValue.map((v) => v.id).slice(0, 5));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search and select vulnerabilities"
              placeholder="Type to search..."
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {`${option.cve} - ${option.packageName}`}
            </li>
          )}
          sx={{ mt: 2 }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Select up to 5 vulnerabilities to compare side by side
        </Typography>
      </Paper>

      {selectedVulns.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No vulnerabilities selected for comparison
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Use the search above to select vulnerabilities to compare
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Side-by-side comparison cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {selectedVulns.map((vuln) => (
              <Grid item xs={12} md={6} lg={4} key={vuln.id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {vuln.cve}
                        </Typography>
                        <Chip
                          label={vuln.severity}
                          color={getSeverityColor(vuln.severity)}
                          size="small"
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemove(vuln.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      <strong>CVSS:</strong> {vuln.cvss.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Package:</strong> {vuln.packageName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Version:</strong> {vuln.packageVersion}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Comparison table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  {selectedVulns.map((vuln) => (
                    <TableCell key={vuln.id}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {vuln.cve}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {comparisonFields.map(({ label, field }) => (
                  <TableRow key={field}>
                    <TableCell>
                      <strong>{label}</strong>
                    </TableCell>
                    {selectedVulns.map((vuln) => (
                      <TableCell key={vuln.id}>
                        {field === 'severity' ? (
                          <Chip
                            label={String(vuln[field] || '')}
                            color={getSeverityColor(String(vuln[field] || ''))}
                            size="small"
                          />
                        ) : (
                          String(vuln[field] || 'N/A')
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}

export default Comparison;

