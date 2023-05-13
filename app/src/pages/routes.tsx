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
import Members from "./Members";
import { CampGetType } from "../camps";
import Settings from "./Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
    children: [
      { index: true, element: <Home /> },
      {
        element: <PrivateRoutes />,
        children: [
          { path: "students", element: <Students /> },
          { path: "camps", element: <Camps campGetType={CampGetType.camps} /> },
          {
            path: "camps/:id",
            element: <Camp campGetType={CampGetType.camps} />,
          },
          { path: "teach", element: <Camps campGetType={CampGetType.teach} /> },
          {
            path: "teach/:id",
            element: <Camp campGetType={CampGetType.teach} />,
          },
          { path: "programs", element: <Programs /> },
          { path: "programs/:id", element: <Program /> },
          {
            path: "schedule",
            element: <Camps campGetType={CampGetType.schedule} />,
          },
          {
            path: "schedule/:id",
            element: <Camp campGetType={CampGetType.schedule} />,
          },
          { path: "members", element: <Members /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);

export default router;
