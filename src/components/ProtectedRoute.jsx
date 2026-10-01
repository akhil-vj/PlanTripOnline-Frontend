import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const token = localStorage.getItem('token');
  const isAdmin = token === 'admin-token';

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/user-dashboard" replace />;
  }

  if (userOnly && isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
