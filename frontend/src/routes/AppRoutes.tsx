import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { Tickets } from '../pages/Tickets';
import { CreateTicket } from '../pages/CreateTicket';
import { EditTicket } from '../pages/EditTicket';
import { TicketDetails } from '../pages/TicketDetails';
import { Users } from '../pages/Users';
import { Profile } from '../pages/Profile';
import { NotFound } from '../pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect to dashboard or login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public Routes (wrapped in AuthLayout) */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* Protected Routes (wrapped in DashboardLayout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/tickets/:id/edit" element={<EditTicket />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Only Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

