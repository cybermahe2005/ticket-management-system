import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ticketApi } from '../api/ticketApi';
import { userApi } from '../api/userApi';
import { Ticket } from '../types/ticket';
import { StatusChip } from '../components/common/StatusChip';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    closedTickets: 0,
    totalUsers: 0,
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all tickets for stats calculation (up to 100 for user/admin)
      const ticketsResponse = await ticketApi.getTickets({ limit: 100 });
      const tickets = ticketsResponse.items;

      const openCount = tickets.filter((t) => t.status === 'OPEN').length;
      const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
      const closedCount = tickets.filter((t) => t.status === 'CLOSED').length;

      let usersCount = 0;
      if (isAdmin) {
        try {
          const usersRes = await userApi.getUsers({ limit: 1 });
          usersCount = usersRes.total;
        } catch {
          // If users fetch fails, continue with ticket stats
        }
      }

      setStats({
        totalTickets: ticketsResponse.total,
        openTickets: openCount,
        inProgressTickets: inProgressCount,
        closedTickets: closedCount,
        totalUsers: usersCount,
      });

      // Keep most recent 5
      setRecentTickets(tickets.slice(0, 5));
    } catch {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isAdmin]);

  if (loading) {
    return <LoadingSpinner minHeight={400} message="Loading your dashboard..." />;
  }

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.totalTickets,
      icon: <ConfirmationNumberIcon sx={{ fontSize: 28, color: '#2563EB' }} />,
      bgColor: '#EFF6FF',
    },
    ...(isAdmin
      ? [
          {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: <PeopleOutlineIcon sx={{ fontSize: 28, color: '#7C3AED' }} />,
            bgColor: '#F5F3FF',
          },
        ]
      : []),
    {
      title: 'Open Tickets',
      value: stats.openTickets,
      icon: <HourglassEmptyIcon sx={{ fontSize: 28, color: '#0284C7' }} />,
      bgColor: '#F0F9FF',
    },
    {
      title: 'In Progress',
      value: stats.inProgressTickets,
      icon: <PendingActionsIcon sx={{ fontSize: 28, color: '#D97706' }} />,
      bgColor: '#FFFBEB',
    },
    {
      title: 'Closed Tickets',
      value: stats.closedTickets,
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 28, color: '#16A34A' }} />,
      bgColor: '#F0FDF4',
    },
  ];

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
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Welcome back, {user?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isAdmin
              ? 'Administrator Overview - System-wide ticket and user metrics.'
              : 'Here is an overview of your active and recent support tickets.'}
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

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* KPI Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={isAdmin ? 2.4 : 3} key={idx}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.15s ease-in-out',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      backgroundColor: card.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Tickets Section */}
      <Card sx={{ mb: 4 }}>
        <Box
          sx={{
            p: 3,
            pb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Tickets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isAdmin ? 'Latest tickets submitted across the system' : 'Your most recent requests'}
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/tickets')}
            sx={{ fontWeight: 600 }}
          >
            View All
          </Button>
        </Box>

        {recentTickets.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No tickets found.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate('/tickets/create')}
            >
              Create your first ticket
            </Button>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 90 }}>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell sx={{ width: 140 }}>Status</TableCell>
                  {isAdmin && <TableCell>Submitted By</TableCell>}
                  <TableCell sx={{ width: 160 }}>Created Date</TableCell>
                  <TableCell align="right" sx={{ width: 100 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTickets.map((t) => (
                  <TableRow key={t.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/tickets/${t.id}`)}>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>#{t.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0F172A' }}>{t.title}</TableCell>
                    <TableCell>
                      <StatusChip status={t.status} />
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {t.created_by?.name || `User #${t.user_id}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t.created_by?.email}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {new Date(t.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/${t.id}`);
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};

