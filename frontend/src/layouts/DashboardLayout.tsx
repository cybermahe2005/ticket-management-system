import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';

export const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Navbar onToggleSidebar={handleToggleSidebar} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 4,
            px: { xs: 2, sm: 3, md: 4 },
            maxWidth: '100%',
            overflowX: 'hidden',
          }}
        >
          <Container maxWidth="xl" sx={{ p: 0 }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

