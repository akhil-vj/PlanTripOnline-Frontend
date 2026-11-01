import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const token     = localStorage.getItem('token');
  const userRole  = localStorage.getItem('userRole');  // 'admin' | 'user'
  const userEmail = localStorage.getItem('userEmail');

  // Treat as admin if role field says so OR legacy email matches
  const isAdmin = userRole === 'admin' || userEmail === 'admin@plantriponline.com';

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    // Logged-in user (non-admin) trying to access admin area → user dashboard
    return <Navigate to="/user-dashboard" replace />;
  }

  if (userOnly && isAdmin) {
    // Admin trying to access user-only area → admin dashboard
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
