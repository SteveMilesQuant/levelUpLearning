import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import ErrorPage from "./ErrorPage";
import Home from "./Home";
import Students from "./Students";
import Camps from "./Camps";
import Camp from "./Camp";
import Program from "./Program";
import Programs from "./Programs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "students", element: <Students /> },
      { path: "camps", element: <Camps /> },
      { path: "camps/:id", element: <Camp /> },
      { path: "programs", element: <Programs /> },
      { path: "programs/:id", element: <Program /> },
      { path: "schedule", element: <Camps forScheduling={true} /> },
    ],
  },
]);

export default router;
