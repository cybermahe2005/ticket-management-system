import React from 'react';
import { Box, Card, Container, Typography } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A',
        backgroundImage: 'radial-gradient(at 50% 0%, #1E293B 0%, #0F172A 75%)',
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              backgroundColor: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.35)',
              mb: 2,
            }}
          >
            <ConfirmationNumberIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700, letterSpacing: '-0.02em' }}>
            TicketFlow
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
            Enterprise Ticket Management System
          </Typography>
        </Box>

        <Card
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Outlet />
        </Card>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            Secure JWT Authentication &bull; Role-Based Authorization
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

