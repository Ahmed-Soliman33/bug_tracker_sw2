import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

import ProtectedRoute from '@/routes/ProtectedRoute'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

import AdminLayout from '@/components/layout/AdminLayout'
import StaffLayout from '@/components/layout/StaffLayout'
import CustomerLayout from '@/components/layout/CustomerLayout'

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard'
import ProjectsListPage from '@/pages/admin/ProjectsListPage'
import CreateProjectPage from '@/pages/admin/CreateProjectPage'
import AllBugsPage from '@/pages/admin/AllBugsPage'
import UsersListPage from '@/pages/admin/UsersListPage'

// Staff pages
import StaffDashboard from '@/pages/staff/StaffDashboard'
import MyAssignedBugsPage from '@/pages/staff/MyAssignedBugsPage'

// Customer pages
import CustomerDashboard from '@/pages/customer/CustomerDashboard'
import MyBugsPage from '@/pages/customer/MyBugsPage'
import CreateBugPage from '@/pages/customer/CreateBugPage'

// Shared pages
import BugDetailPage from '@/pages/shared/BugDetailPage'
import NotificationsPage from '@/pages/shared/NotificationsPage'

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
        <Route path="projects" element={<ProjectsListPage />} />
        <Route path="projects/new" element={<CreateProjectPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="bugs" element={<AllBugsPage />} />
        <Route path="bugs/:id" element={<BugDetailPage rolePrefix="admin" />} />
        <Route path="users" element={<UsersListPage />} />
        <Route path="notifications" element={<NotificationsPage rolePrefix="admin" />} />
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
        <Route path="bugs" element={<MyAssignedBugsPage />} />
        <Route path="bugs/:id" element={<BugDetailPage rolePrefix="staff" />} />
        <Route path="notifications" element={<NotificationsPage rolePrefix="staff" />} />
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
        <Route path="bugs" element={<MyBugsPage />} />
        <Route path="bugs/new" element={<CreateBugPage />} />
        <Route path="bugs/:id" element={<BugDetailPage rolePrefix="customer" />} />
        <Route path="notifications" element={<NotificationsPage rolePrefix="customer" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function ProjectDetailPage() {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">Project Detail</h1>
      <p className="text-muted-foreground text-sm">View project bugs and details.</p>
    </div>
  )
}
