import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  console.log('PrivateRoute:', { user, loading }); // Debug log

  // If still loading, render nothing or a loading indicator
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If user is authenticated (has user and token), render protected route
  // Otherwise, redirect to login
  return user && user.token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
