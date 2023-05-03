import { Navigate, Outlet } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const PrivateRoutes = () => {
  const { signedIn } = useLogin();
  if (!signedIn) return <Navigate to="/" />;
  return <Outlet />;
};

export default PrivateRoutes;
