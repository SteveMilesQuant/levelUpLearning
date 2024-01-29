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
import { CampsContext, CampsContextType } from "../camps";
import Settings from "./Settings";
import About from "./About";
import Contact from "./Contact";
import Privacy from "./privacy";

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
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "camps",
        element: (
          <CampsContext.Provider value={CampsContextType.camps}>
            <Camps />
          </CampsContext.Provider>
        ),
      },
      {
        path: "camps/:id",
        element: (
          <CampsContext.Provider value={CampsContextType.camps}>
            <Camp />
          </CampsContext.Provider>
        ),
      },
      {
        element: <PrivateRoutes />,
        children: [
          { path: "students", element: <Students /> },
          {
            path: "teach",
            element: (
              <CampsContext.Provider value={CampsContextType.teach}>
                <Camps />
              </CampsContext.Provider>
            ),
          },
          {
            path: "teach/:id",
            element: (
              <CampsContext.Provider value={CampsContextType.teach}>
                <Camp />
              </CampsContext.Provider>
            ),
          },
          { path: "programs", element: <Programs /> },
          { path: "programs/:id", element: <Program /> },
          {
            path: "schedule",
            element: (
              <CampsContext.Provider value={CampsContextType.schedule}>
                <Camps />
              </CampsContext.Provider>
            ),
          },
          {
            path: "schedule/:id",
            element: (
              <CampsContext.Provider value={CampsContextType.schedule}>
                <Camp />
              </CampsContext.Provider>
            ),
          },
          { path: "members", element: <Members /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);

export default router;
