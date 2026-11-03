import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const registeredMessage = location.state?.registered
    ? 'Account created successfully! Please sign in with your credentials.'
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: location.state?.email || '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage(null);
      await login(data);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        setErrorMessage(axiosErr.response?.data?.detail || 'Invalid email or password. Please try again.');
      } else {
        setErrorMessage('Unable to connect to the server. Please verify your connection.');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
        Welcome Back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        Sign in to your account to manage support tickets
      </Typography>

      {registeredMessage && !errorMessage && (
        <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
          {registeredMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email Address"
        variant="outlined"
        margin="normal"
        autoComplete="email"
        autoFocus
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={isSubmitting}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        margin="normal"
        autoComplete="current-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isSubmitting}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isSubmitting}
        sx={{ mt: 3, mb: 2, height: 44 }}
      >
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to="/register" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
