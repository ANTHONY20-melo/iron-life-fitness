import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

import PublicLayout from '@/components/layout/PublicLayout'
import StudentLayout from '@/components/layout/StudentLayout'
import AdminLayout from '@/components/layout/AdminLayout'

import Home from '@/pages/public/Home'
import Login from '@/pages/public/Login'
import Register from '@/pages/public/Register'
import NotFound from '@/pages/public/NotFound'

import StudentDashboard from '@/pages/student/StudentDashboard'
import Workouts from '@/pages/student/Workouts'
import WorkoutDetail from '@/pages/student/WorkoutDetail'
import History from '@/pages/student/History'
import Evolution from '@/pages/student/Evolution'
import Assessments from '@/pages/student/Assessments'
import Schedule from '@/pages/student/Schedule'
import StudentPayments from '@/pages/student/Payments'
import Achievements from '@/pages/student/Achievements'
import Profile from '@/pages/student/Profile'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import Students from '@/pages/admin/Students'
import StudentDetail from '@/pages/admin/StudentDetail'
import Trainers from '@/pages/admin/Trainers'
import AdminWorkouts from '@/pages/admin/Workouts'
import Exercises from '@/pages/admin/Exercises'
import Plans from '@/pages/admin/Plans'
import AdminPayments from '@/pages/admin/Payments'
import CheckIns from '@/pages/admin/CheckIns'
import AdminAssessments from '@/pages/admin/Assessments'
import AdminSchedule from '@/pages/admin/Schedule'
import Settings from '@/pages/admin/Settings'

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default function App() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student */}
      <Route
        path="/student"
        element={
          <ProtectedRoute roles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="workouts/:id" element={<WorkoutDetail />} />
        <Route path="history" element={<History />} />
        <Route path="evolution" element={<Evolution />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin', 'trainer']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="trainers" element={<Trainers />} />
        <Route path="workouts" element={<AdminWorkouts />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="plans" element={<Plans />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="checkins" element={<CheckIns />} />
        <Route path="assessments" element={<AdminAssessments />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
