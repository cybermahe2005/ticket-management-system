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
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { userApi } from '../api/userApi';
import { User } from '../types/auth';
import { RoleChip } from '../components/common/RoleChip';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await userApi.getUsers({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
      });
      setUsers(res.items);
      setTotal(res.total);
    } catch {
      setError('Failed to fetch user directory. Administrator privileges required.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          User Directory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administrator view of all registered user accounts and their system roles.
        </Typography>
      </Box>

      {/* Search Bar */}
      <Card sx={{ p: 2.5, mb: 3 }}>
        <TextField
          placeholder="Search users by name or email address..."
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
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        {loading ? (
          <LoadingSpinner minHeight={300} message="Loading user directory..." />
        ) : users.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try refining your search keyword.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 90 }}>User ID</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email Address</TableCell>
                    <TableCell sx={{ width: 140 }}>Role</TableCell>
                    <TableCell sx={{ width: 180 }}>Registration Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        #{u.id}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#0F172A' }}>
                        {u.name}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{u.email}</TableCell>
                      <TableCell>
                        <RoleChip role={u.role} />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>
                        {new Date(u.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
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
    </Box>
  );
};

