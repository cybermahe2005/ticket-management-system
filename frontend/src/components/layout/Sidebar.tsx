import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GroupIcon from '@mui/icons-material/Group';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 250;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'All Tickets', path: '/tickets', icon: <ConfirmationNumberIcon /> },
    { label: 'Create Ticket', path: '/tickets/create', icon: <AddCircleOutlineIcon /> },
    ...(isAdmin
      ? [{ label: 'Users Management', path: '/users', icon: <GroupIcon /> }]
      : []),
    { label: 'Profile', path: '/profile', icon: <PersonOutlineIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 2 }}>
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography variant="overline" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.08em' }}>
          NAVIGATION
        </Typography>
      </Box>

      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected =
            item.path === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.path);

          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNav(item.path)}
              selected={isSelected}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 1,
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  '& .MuiListItemIcon-root': {
                    color: '#2563EB',
                  },
                  fontWeight: 600,
                },
                '&:hover': {
                  backgroundColor: '#F1F5F9',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isSelected ? '#2563EB' : '#64748B',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 600 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ px: 3 }}>
        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
          Ticket System v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: '1px solid #E2E8F0',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid #E2E8F0',
            top: 64, // Height of top AppBar
            height: 'calc(100% - 64px)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

