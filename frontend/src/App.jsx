import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Books from './pages/Books';
import AddBook from './pages/AddBook';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import IssueBook from './pages/IssueBook';
import ReturnBook from './pages/ReturnBook';
import BorrowHistory from './pages/BorrowHistory';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            {user?.role === 'student' ? (
              <Navigate to="/student-dashboard" replace />
            ) : (
              <Navigate to="/admin-dashboard" replace />
            )}
          </PrivateRoute>
        }
      />

      {/* Admin/Librarian Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute allowedRoles={['admin', 'librarian']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/books"
        element={
          <PrivateRoute allowedRoles={['admin', 'librarian', 'student']}>
            <Books />
          </PrivateRoute>
        }
      />
      <Route
        path="/books/add"
        element={
          <PrivateRoute allowedRoles={['admin', 'librarian']}>
            <AddBook />
          </PrivateRoute>
        }
      />
      <Route
        path="/students"
        element={
          <PrivateRoute allowedRoles={['admin', 'librarian']}>
            <Students />
          </PrivateRoute>
        }
      />
      <Route
        path="/students/add"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AddStudent />
          </PrivateRoute>
        }
      />
      <Route
        path="/issue-book"
        element={
          <PrivateRoute allowedRoles={['admin', 'librarian']}>
            <IssueBook />
          </PrivateRoute>
        }
      />
      <Route
        path="/return-book"
        element={
          <PrivateRoute allowedRoles={['admin', 'librarian']}>
            <ReturnBook />
          </PrivateRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student-dashboard"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-books"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <BorrowHistory />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

