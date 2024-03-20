import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../users";

const PrivateRoutes = () => {
  const { signedIn, expiration, isChecking } = useAuth();
  if (!isChecking && (!signedIn || (expiration && expiration <= new Date()))) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default PrivateRoutes;
