import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Grid,
  Button,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleChip } from '../components/common/RoleChip';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your account credentials and system authorization level.
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: '#2563EB',
                width: 72,
                height: 72,
                fontSize: '1.75rem',
                fontWeight: 700,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {user.name}
                </Typography>
                <RoleChip role={user.role} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                USER ID
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                #{user.id}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                ACCESS ROLE
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <RoleChip role={user.role} />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                REGISTERED EMAIL
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                {user.email}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                MEMBER SINCE
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                {new Date(user.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<ConfirmationNumberIcon />}
              onClick={() => navigate('/tickets')}
            >
              View My Tickets
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Sign Out
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

