import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

import ProtectedRoute from '@/routes/ProtectedRoute'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

import AdminLayout from '@/components/layout/AdminLayout'
import StaffLayout from '@/components/layout/StaffLayout'
import CustomerLayout from '@/components/layout/CustomerLayout'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import StaffDashboard from '@/pages/staff/StaffDashboard'
import CustomerDashboard from '@/pages/customer/CustomerDashboard'

const ROLE_DEFAULT = { ADMIN: '/admin/dashboard', STAFF: '/staff/dashboard', CUSTOMER: '/customer/dashboard' }

function RootRedirect() {
  const user = useAuthStore((s) => s.user)
  if (user) return <Navigate to={ROLE_DEFAULT[user.role] ?? '/login'} replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {/* Public auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin — nested layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* Phase 3 pages wired here */}
        <Route path="projects" element={<PlaceholderPage title="Projects" />} />
        <Route path="projects/new" element={<PlaceholderPage title="New Project" />} />
        <Route path="projects/:id" element={<PlaceholderPage title="Project Detail" />} />
        <Route path="bugs" element={<PlaceholderPage title="All Bugs" />} />
        <Route path="bugs/:id" element={<PlaceholderPage title="Bug Detail" />} />
        <Route path="users" element={<PlaceholderPage title="Users" />} />
        <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
      </Route>

      {/* Staff — nested layout */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['STAFF']}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="bugs" element={<PlaceholderPage title="My Assigned Bugs" />} />
        <Route path="bugs/:id" element={<PlaceholderPage title="Bug Detail" />} />
        <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
      </Route>

      {/* Customer — nested layout */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="bugs" element={<PlaceholderPage title="My Bugs" />} />
        <Route path="bugs/new" element={<PlaceholderPage title="Report a Bug" />} />
        <Route path="bugs/:id" element={<PlaceholderPage title="Bug Detail" />} />
        <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">Phase 3 — coming soon.</p>
    </div>
  )
}
