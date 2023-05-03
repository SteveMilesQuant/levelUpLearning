import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoutes = () => {
  const { signedIn } = useAuth();
  if (!signedIn) return <Navigate to="/" />;
  return <Outlet />;
};

export default PrivateRoutes;
