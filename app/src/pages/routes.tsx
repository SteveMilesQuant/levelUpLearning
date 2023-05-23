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
import { CampsPageContext } from "../camps";
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
          {
            path: "camps",
            element: <Camps campsPageContext={CampsPageContext.camps} />,
          },
          {
            path: "camps/:id",
            element: <Camp campsPageContext={CampsPageContext.camps} />,
          },
          {
            path: "teach",
            element: <Camps campsPageContext={CampsPageContext.teach} />,
          },
          {
            path: "teach/:id",
            element: <Camp campsPageContext={CampsPageContext.teach} />,
          },
          { path: "programs", element: <Programs /> },
          { path: "programs/:id", element: <Program /> },
          {
            path: "schedule",
            element: <Camps campsPageContext={CampsPageContext.schedule} />,
          },
          {
            path: "schedule/:id",
            element: <Camp campsPageContext={CampsPageContext.schedule} />,
          },
          { path: "members", element: <Members /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);

export default router;
