import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB', // Vibrant enterprise blue
      dark: '#1D4ED8',
      light: '#3B82F6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0F172A', // Deep Navy
      dark: '#020617',
      light: '#334155',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
    info: {
      main: '#0284C7',
      light: '#E0F2FE',
    },
    warning: {
      main: '#D97706',
      light: '#FEF3C7',
    },
    success: {
      main: '#16A34A',
      light: '#DCFCE7',
    },
    error: {
      main: '#DC2626',
      light: '#FEE2E2',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#0F172A',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#0F172A',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#0F172A',
    },
    subtitle1: {
      fontWeight: 500,
      color: '#475569',
    },
    subtitle2: {
      fontWeight: 500,
      color: '#64748B',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.45,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 18px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1D4ED8',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderColor: '#E2E8F0',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#F8FAFC',
          color: '#475569',
          borderBottom: '1px solid #E2E8F0',
        },
        body: {
          borderBottom: '1px solid #F1F5F9',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

