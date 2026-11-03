import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Button,
  IconButton,
  InputAdornment,
  Tooltip,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ticketApi } from '../api/ticketApi';
import { Ticket, TicketStatus } from '../types/ticket';
import { StatusChip } from '../components/common/StatusChip';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { NotificationSnackbar } from '../components/common/NotificationSnackbar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Tickets: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Delete dialog state
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ticketApi.getTickets({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter,
        search: searchTerm,
      });
      setTickets(res.items);
      setTotal(res.total);
    } catch {
      setError('Failed to fetch tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, searchTerm]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteConfirm = async () => {
    if (!ticketToDelete) return;
    try {
      setDeleteLoading(true);
      await ticketApi.deleteTicket(ticketToDelete.id);
      setSnackbar({
        open: true,
        message: `Ticket #${ticketToDelete.id} successfully deleted`,
        severity: 'success',
      });
      setTicketToDelete(null);
      fetchTickets();
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

  return (
    <Box>
      {/* Header */}
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
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {isAdmin ? 'All Support Tickets' : 'My Support Tickets'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isAdmin
              ? 'Manage and respond to all user support inquiries across the platform.'
              : 'Create, monitor, and update your personal support requests.'}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/tickets/create')}
          sx={{ height: 42, px: 2.5 }}
        >
          Create Ticket
        </Button>
      </Box>

      {/* Filters Toolbar */}
      <Card sx={{ p: 2.5, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          <TextField
            placeholder="Search tickets by title or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />

          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as TicketStatus | '');
              setPage(0);
            }}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="CLOSED">Closed</MenuItem>
          </TextField>
        </Box>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tickets Table */}
      <Card>
        {loading ? (
          <LoadingSpinner minHeight={300} message="Loading tickets..." />
        ) : tickets.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              No tickets found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || statusFilter
                ? 'Try clearing your filters or search keywords.'
                : 'You have not submitted any support tickets yet.'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/tickets/create')}
            >
              Create New Ticket
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 80 }}>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell sx={{ width: 130 }}>Status</TableCell>
                    {isAdmin && <TableCell sx={{ width: 180 }}>Created By</TableCell>}
                    <TableCell sx={{ width: 150 }}>Created Date</TableCell>
                    <TableCell sx={{ width: 150 }}>Updated Date</TableCell>
                    <TableCell align="right" sx={{ width: 140 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        #{ticket.id}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                          {ticket.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {ticket.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={ticket.status} />
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {ticket.created_by?.name || `User #${ticket.user_id}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ticket.created_by?.email}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {new Date(ticket.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {new Date(ticket.updated_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/tickets/${ticket.id}`)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit Ticket">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete Ticket">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setTicketToDelete(ticket)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(ticketToDelete)}
        title="Delete Support Ticket"
        message={`Are you sure you want to permanently delete ticket #${ticketToDelete?.id} "${ticketToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Ticket"
        confirmColor="error"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTicketToDelete(null)}
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

