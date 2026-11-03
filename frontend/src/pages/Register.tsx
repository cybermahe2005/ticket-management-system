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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Full Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain at least one digit')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage(null);
      await authRegister({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      // Redirect to login with success state
      navigate('/login', {
        state: { registered: true, email: data.email },
      });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        setErrorMessage(
          axiosErr.response?.data?.detail || 'Registration failed. Please check your information.'
        );
      } else {
        setErrorMessage('Unable to connect to the server. Please try again.');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
        Create Account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        Sign up to start creating and tracking your support tickets
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Full Name"
        variant="outlined"
        margin="normal"
        autoComplete="name"
        autoFocus
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={isSubmitting}
      />

      <TextField
        fullWidth
        label="Email Address"
        variant="outlined"
        margin="normal"
        autoComplete="email"
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
        autoComplete="new-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message || 'Minimum 8 characters with at least 1 letter and 1 number'}
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

      <TextField
        fullWidth
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        variant="outlined"
        margin="normal"
        autoComplete="new-password"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        disabled={isSubmitting}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

