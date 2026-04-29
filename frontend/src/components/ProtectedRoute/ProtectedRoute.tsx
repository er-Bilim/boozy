import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

const ProtectedRoute = () => {
  const user = useAppSelector((state) => state.users.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
