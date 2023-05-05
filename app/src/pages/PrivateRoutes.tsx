import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoutes = () => {
  const { signedIn, isChecking } = useAuth();
  if (!signedIn && !isChecking) return <Navigate to="/" />;
  return <Outlet />;
};

export default PrivateRoutes;
