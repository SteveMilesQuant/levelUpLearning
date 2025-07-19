import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../users";
import useAlert from "../hooks/useAlerts";

const PrivateRoutes = () => {
  const { signedIn, expiration, isChecking } = useAuth();
  const { setAlert } = useAlert();
  const location = useLocation();

  if (!isChecking && (!signedIn || (expiration && expiration <= new Date()))) {
    setAlert({
      status: "error",
      message: `Please log in to access ${location.pathname}.`,
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default PrivateRoutes;
