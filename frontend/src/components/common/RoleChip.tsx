import React from 'react';
import { Chip } from '@mui/material';
import { UserRole } from '../../types/auth';

interface RoleChipProps {
  role: UserRole;
  size?: 'small' | 'medium';
}

export const RoleChip: React.FC<RoleChipProps> = ({ role, size = 'small' }) => {
  const isAdmin = role === 'ADMIN';

  return (
    <Chip
      label={isAdmin ? 'Admin' : 'User'}
      size={size}
      sx={{
        fontWeight: 600,
        backgroundColor: isAdmin ? '#F5F3FF' : '#F1F5F9',
        color: isAdmin ? '#6D28D9' : '#475569',
        border: `1px solid ${isAdmin ? '#DDD6FE' : '#CBD5E1'}`,
      }}
    />
  );
};

