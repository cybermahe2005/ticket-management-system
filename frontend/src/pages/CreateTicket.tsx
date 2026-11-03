import React, { useState } from 'react';
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
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import { NotificationSnackbar } from '../components/common/NotificationSnackbar';

const createTicketSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
});

type CreateTicketFormData = z.infer<typeof createTicketSchema>;

export const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateTicketFormData) => {
    try {
      setErrorMessage(null);
      await ticketApi.createTicket(data);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/tickets');
      }, 700);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        setErrorMessage(axiosErr.response?.data?.detail || 'Failed to create ticket. Please check the form.');
      } else {
        setErrorMessage('Unable to connect to the server. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/tickets" color="inherit" underline="hover">
          Tickets
        </Link>
        <Typography color="text.primary">Create Ticket</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Create New Ticket
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Submit a new issue or inquiry. Our support team will review and respond promptly.
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
              placeholder="Brief summary of the issue (e.g. Cannot access billing receipts)"
              variant="outlined"
              margin="normal"
              autoFocus
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={isSubmitting}
            />

            <TextField
              fullWidth
              label="Detailed Description"
              placeholder="Provide specific details, steps to reproduce, or error messages encountered..."
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
                onClick={() => navigate('/tickets')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ minWidth: 140, height: 42 }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Ticket'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <NotificationSnackbar
        open={snackbarOpen}
        message="Ticket created successfully!"
        severity="success"
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

