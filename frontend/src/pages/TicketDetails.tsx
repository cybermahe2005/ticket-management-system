import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Alert,
  Breadcrumbs,
  Link,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ticketApi } from '../api/ticketApi';
import { Ticket } from '../types/ticket';
import { StatusChip } from '../components/common/StatusChip';
import { RoleChip } from '../components/common/RoleChip';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { NotificationSnackbar } from '../components/common/NotificationSnackbar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchTicket = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await ticketApi.getTicketById(Number(id));
      setTicket(data);
    } catch {
      setError('Failed to load ticket details. The ticket may not exist or you do not have permission.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleDelete = async () => {
    if (!ticket) return;
    try {
      setDeleteLoading(true);
      await ticketApi.deleteTicket(ticket.id);
      setDeleteOpen(false);
      setSnackbar({
        open: true,
        message: `Ticket #${ticket.id} deleted successfully`,
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/tickets');
      }, 700);
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to delete ticket. You may not have permission.',
        severity: 'error',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner minHeight={400} message="Loading ticket details..." />;
  }

  if (error || !ticket) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Ticket not found'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/tickets')}>
          Back to Tickets
        </Button>
      </Box>
    );
  }

  const canEditOrDelete = isAdmin || ticket.user_id === user?.id;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/tickets" color="inherit" underline="hover">
          Tickets
        </Link>
        <Typography color="text.primary">Ticket #{ticket.id}</Typography>
      </Breadcrumbs>

      {/* Top action bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
            onClick={() => navigate('/tickets')}
          >
            Back
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Ticket #{ticket.id}
          </Typography>
          <StatusChip status={ticket.status} size="medium" />
        </Box>

        {canEditOrDelete && (
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
            >
              Edit Ticket
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Main Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                TITLE
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', mb: 3 }}>
                {ticket.title}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                DESCRIPTION
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: '#F8FAFC',
                  borderRadius: 2,
                  border: '1px solid #E2E8F0',
                  mt: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#1E293B' }}
                >
                  {ticket.description}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Ticket Information
              </Typography>

              <Divider sx={{ mb: 2.5 }} />

              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <PersonOutlineIcon fontSize="small" color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Created By
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#0F172A' }}>
                  {ticket.created_by?.name || `User #${ticket.user_id}`}
                </Typography>
                {ticket.created_by && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {ticket.created_by.email}
                    </Typography>
                    <RoleChip role={ticket.created_by.role} size="small" />
                  </Box>
                )}
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Created Date
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {new Date(ticket.created_at).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <UpdateIcon fontSize="small" color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {new Date(ticket.updated_at).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Ticket"
        message={`Are you sure you want to permanently delete ticket #${ticket.id}?`}
        confirmText="Delete"
        confirmColor="error"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      {/* Notification Toast */}
      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

