import { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={2} sx={{ zIndex: 100000 }}>
        <Toolbar style={{ zIndex: 100000 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            KaiCyber Security Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Navigation currentPath={location.pathname} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
          }}
        >
          <Container maxWidth={false}>{children}</Container>
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;

