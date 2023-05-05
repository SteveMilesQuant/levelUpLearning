import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import ErrorPage from "./ErrorPage";
import Home from "./Home";
import Students from "./Students";
import Camps from "./Camps";
import Camp from "./Camp";
import Program from "./Program";
import Programs from "./Programs";
import PrivateRoutes from "./PrivateRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <PrivateRoutes />,
        children: [
          { path: "students", element: <Students /> },
          { path: "camps", element: <Camps forScheduling={false} /> },
          { path: "camps/:id", element: <Camp /> },
          { path: "programs", element: <Programs /> },
          { path: "programs/:id", element: <Program /> },
          { path: "schedule", element: <Camps forScheduling={true} /> },
        ],
      },
    ],
  },
]);

export default router;
