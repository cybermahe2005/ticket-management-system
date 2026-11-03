import React from 'react';
import { Chip } from '@mui/material';
import { TicketStatus } from '../../types/ticket';

interface StatusChipProps {
  status: TicketStatus;
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  const getChipProps = () => {
    switch (status) {
      case 'OPEN':
        return {
          label: 'Open',
          sx: {
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            border: '1px solid #BFDBFE',
          },
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          sx: {
            backgroundColor: '#FFFBEB',
            color: '#B45309',
            border: '1px solid #FDE68A',
          },
        };
      case 'CLOSED':
        return {
          label: 'Closed',
          sx: {
            backgroundColor: '#F0FDF4',
            color: '#15803D',
            border: '1px solid #BBF7D0',
          },
        };
      default:
        return {
          label: status,
          sx: {},
        };
    }
  };

  const { label, sx } = getChipProps();

  return <Chip label={label} size={size} sx={{ fontWeight: 600, ...sx }} />;
};

