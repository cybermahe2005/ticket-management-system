import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '5rem', sm: '7rem' },
            color: '#CBD5E1',
            lineHeight: 1,
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
          The page you are looking for doesn&apos;t exist or has been moved to another URL.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

