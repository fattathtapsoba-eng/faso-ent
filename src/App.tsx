import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PWAInstallPrompt } from './components/features/PWAInstallPrompt';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Students } from './pages/admin/Students';
import { Finances } from './pages/admin/Finances';
import { Settings } from './pages/admin/Settings';
import { TeacherManagement } from './pages/admin/TeacherManagement';
import { ParentManagement } from './pages/admin/ParentManagement';
import { ComposeParentMessage } from './pages/admin/ComposeParentMessage';
import { Services } from './pages/admin/Services';
import { GradeEntry } from './pages/teacher/GradeEntry';
import { TeacherSchedule } from './pages/teacher/Schedule';
import { Attendance } from './pages/teacher/Attendance';
import { TeacherDashboard } from './pages/teacher/Dashboard';
import { ParentDashboard } from './pages/parent/Dashboard';
import { Children } from './pages/parent/Children';
import { ChildGrades } from './pages/parent/ChildGrades';
import { Payments } from './pages/parent/Payments';
import { ChildSchedule } from './pages/parent/ChildSchedule';
import { StudentDashboard } from './pages/student/Dashboard';
import { MyGrades } from './pages/student/MyGrades';
import { MySchedule } from './pages/student/MySchedule';
import { Notifications } from './pages/Notifications';
import { Messages } from './pages/Messages';
import { MessageThread } from './pages/MessageThread';
import { ComposeMessage } from './pages/ComposeMessage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Simple auth check
function RequireAuth({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/students"
            element={
              <RequireAuth>
                <Students />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/finances"
            element={
              <RequireAuth>
                <Finances />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/teachers"
            element={
              <RequireAuth>
                <TeacherManagement />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/parents"
            element={
              <RequireAuth>
                <ParentManagement />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/messages/compose"
            element={
              <RequireAuth>
                <ComposeParentMessage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/services"
            element={
              <RequireAuth>
                <Services />
              </RequireAuth>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <RequireAuth>
                <TeacherDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/grade-entry"
            element={
              <RequireAuth>
                <GradeEntry />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/schedule"
            element={
              <RequireAuth>
                <TeacherSchedule />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/attendance"
            element={
              <RequireAuth>
                <Attendance />
              </RequireAuth>
            }
          />

          {/* Parent Routes */}
          <Route
            path="/parent/dashboard"
            element={
              <RequireAuth>
                <ParentDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/parent/children"
            element={
              <RequireAuth>
                <Children />
              </RequireAuth>
            }
          />
          <Route
            path="/parent/grades/:childId?"
            element={
              <RequireAuth>
                <ChildGrades />
              </RequireAuth>
            }
          />
          <Route
            path="/parent/schedule/:childId?"
            element={
              <RequireAuth>
                <ChildSchedule />
              </RequireAuth>
            }
          />
          <Route
            path="/parent/payments"
            element={
              <RequireAuth>
                <Payments />
              </RequireAuth>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <RequireAuth>
                <StudentDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/student/grades"
            element={
              <RequireAuth>
                <MyGrades />
              </RequireAuth>
            }
          />
          <Route
            path="/student/schedule"
            element={
              <RequireAuth>
                <MySchedule />
              </RequireAuth>
            }
          />

          {/* Shared Routes - Notifications & Messages */}
          <Route
            path="/notifications"
            element={
              <RequireAuth>
                <Notifications />
              </RequireAuth>
            }
          />
          <Route
            path="/messages"
            element={
              <RequireAuth>
                <Messages />
              </RequireAuth>
            }
          />
          <Route
            path="/messages/:threadId"
            element={
              <RequireAuth>
                <MessageThread />
              </RequireAuth>
            }
          />
          <Route
            path="/messages/compose"
            element={
              <RequireAuth>
                <ComposeMessage />
              </RequireAuth>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* DevTools - only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
