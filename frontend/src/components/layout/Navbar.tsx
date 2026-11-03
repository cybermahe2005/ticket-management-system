import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RoleChip } from '../common/RoleChip';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleCloseMenu();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        borderBottom: '1px solid #E2E8F0',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onToggleSidebar}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard')}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                backgroundColor: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <ConfirmationNumberIcon fontSize="small" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.15rem',
                color: '#0F172A',
                letterSpacing: '-0.02em',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              TicketFlow
            </Typography>
          </Box>
        </Box>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                {user.name}
              </Typography>
              <RoleChip role={user.role} />
            </Box>

            <IconButton onClick={handleOpenMenu} sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  bgcolor: '#2563EB',
                  width: 36,
                  height: 36,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: { width: 220, mt: 1.5, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                  {user.email}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <RoleChip role={user.role} />
                </Box>
              </Box>
              <Divider />
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

