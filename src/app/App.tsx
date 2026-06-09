import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AvatarProvider } from '../contexts/AvatarContext';
import Login from '../components/Login';
import DashboardLayout from '../components/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/admin/Users';
import Enrollment from '../pages/admin/Enrollment';
import Reports from '../pages/admin/Reports';
import Grades from '../pages/teacher/Grades';
import Attendance from '../pages/teacher/Attendance';
import StudentGrades from '../pages/parent/StudentGrades';
import Messages from '../pages/Messages';
import Calendar from '../pages/Calendar';
import AvatarMatematico from '../pages/AvatarMatematico';

function StudentRedirect({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role === 'student') return <Navigate to="/dashboard/avatar" replace />;
  return <>{children}</>;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AvatarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentRedirect><Dashboard /></StudentRedirect>} />
              <Route path="/dashboard/users" element={<Users />} />
              <Route path="/dashboard/enrollment" element={<Enrollment />} />
              <Route path="/dashboard/reports" element={<Reports />} />
              <Route path="/dashboard/grades" element={<Grades />} />
              <Route path="/dashboard/attendance" element={<Attendance />} />
              <Route path="/dashboard/student-grades" element={<StudentGrades />} />
              <Route path="/dashboard/messages" element={<Messages />} />
              <Route path="/dashboard/calendar" element={<Calendar />} />
              <Route path="/dashboard/avatar" element={<AvatarMatematico />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        </AvatarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}