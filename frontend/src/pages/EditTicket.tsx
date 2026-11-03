import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ticketApi } from '../api/ticketApi';
import { TicketStatus } from '../types/ticket';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { NotificationSnackbar } from '../components/common/NotificationSnackbar';

const editTicketSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED'] as const).optional(),
});

type EditTicketFormData = z.infer<typeof editTicketSchema>;

export const EditTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [loadingTicket, setLoadingTicket] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditTicketFormData>({
    resolver: zodResolver(editTicketSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'OPEN',
    },
  });

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      try {
        setLoadingTicket(true);
        const ticket = await ticketApi.getTicketById(Number(id));
        reset({
          title: ticket.title,
          description: ticket.description,
          status: ticket.status,
        });
      } catch {
        setErrorMessage('Failed to load ticket details or you do not have permission to view it.');
      } finally {
        setLoadingTicket(false);
      }
    };

    fetchTicket();
  }, [id, reset]);

  const onSubmit = async (data: EditTicketFormData) => {
    if (!id) return;
    try {
      setErrorMessage(null);
      const updatePayload: { title?: string; description?: string; status?: TicketStatus } = {
        title: data.title,
        description: data.description,
      };

      if (isAdmin && data.status) {
        updatePayload.status = data.status;
      }

      await ticketApi.updateTicket(Number(id), updatePayload);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(`/tickets/${id}`);
      }, 700);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        setErrorMessage(axiosErr.response?.data?.detail || 'Failed to update ticket.');
      } else {
        setErrorMessage('Unable to connect to the server. Please try again.');
      }
    }
  };

  if (loadingTicket) {
    return <LoadingSpinner minHeight={400} message="Loading ticket details..." />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/tickets" color="inherit" underline="hover">
          Tickets
        </Link>
        <Link component={RouterLink} to={`/tickets/${id}`} color="inherit" underline="hover">
          Ticket #{id}
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Edit Ticket #{id}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {isAdmin
          ? 'Modify ticket title, description, or update its progress status.'
          : 'Update the title or description of your support ticket.'}
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Ticket Title"
              variant="outlined"
              margin="normal"
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={isSubmitting}
            />

            {isAdmin && (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Ticket Status (Admin Only)"
                    margin="normal"
                    disabled={isSubmitting}
                    sx={{ mt: 2 }}
                  >
                    <MenuItem value="OPEN">Open</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="CLOSED">Closed</MenuItem>
                  </TextField>
                )}
              />
            )}

            <TextField
              fullWidth
              label="Detailed Description"
              variant="outlined"
              margin="normal"
              multiline
              rows={6}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                disabled={isSubmitting}
                onClick={() => navigate(`/tickets/${id}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ minWidth: 140, height: 42 }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <NotificationSnackbar
        open={snackbarOpen}
        message="Ticket updated successfully!"
        severity="success"
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

