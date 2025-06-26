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
import Privacy from "./Privacy";
import DataRequest from "./DataRequest";
import Checkout from "./Checkout";
import Enrollments from "./Enrollments";
import Coupons from "./Coupons";
import Events from "./Events";
import Equip from "./Equip";
import Resources from "./Resources";
import Boast from "./Boast";
import BoastOne from "./BoastOne";
import { ProtectedRoute } from "./ProtectedRoute";

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
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "data-request",
        element: <DataRequest />,
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
        path: "events",
        element: <Events />,
      },
      { path: "resources", element: <Resources /> },
      {
        element: <PrivateRoutes />,
        children: [
          { path: "checkout", element: <Checkout /> },
          { path: "students", element: <Students /> },
          {
            path: "teach",
            element: (
              <ProtectedRoute allowedRole="INSTRUCTOR">
                <CampsContext.Provider value={CampsContextType.teach}>
                  <Camps />
                </CampsContext.Provider>
              </ProtectedRoute>
            ),
          },
          {
            path: "teach/:id",
            element: (
              <ProtectedRoute allowedRole="INSTRUCTOR">
                <CampsContext.Provider value={CampsContextType.teach}>
                  <Camp />
                </CampsContext.Provider>
              </ProtectedRoute>
            ),
          },
          {
            path: "programs", element: (
              <ProtectedRoute allowedRole="INSTRUCTOR">
                <Programs />
              </ProtectedRoute>
            ),
          },
          {
            path: "programs/:id", element: (
              <ProtectedRoute allowedRole="INSTRUCTOR">
                <Program />
              </ProtectedRoute>
            ),
          },
          {
            path: "schedule",
            element: (
              <ProtectedRoute allowedRole="ADMIN">
                <CampsContext.Provider value={CampsContextType.schedule}>
                  <Camps />
                </CampsContext.Provider>
              </ProtectedRoute>
            ),
          },
          {
            path: "schedule/:id",
            element: (
              <ProtectedRoute allowedRole="ADMIN">
                <CampsContext.Provider value={CampsContextType.schedule}>
                  <Camp />
                </CampsContext.Provider>
              </ProtectedRoute>
            ),
          },
          {
            path: "enrollments", element: (
              <ProtectedRoute allowedRole="ADMIN">
                <Enrollments />
              </ProtectedRoute>
            ),
          },
          {
            path: "coupons", element: (
              <ProtectedRoute allowedRole="ADMIN">
                <Coupons />
              </ProtectedRoute>
            )
          },
          {
            path: "members", element: (
              <ProtectedRoute allowedRole="ADMIN">
                <Members />
              </ProtectedRoute>
            )
          },
          {
            path: "equip", element: (
              <ProtectedRoute allowedRole="ADMIN">
                <Equip />
              </ProtectedRoute>
            )
          },
          { path: "settings", element: <Settings /> },
          {
            path: "boast",
            element: (
              <ProtectedRoute allowedRole="ADMIN">
                <Boast />
              </ProtectedRoute>
            ),
          },
          {
            path: "boast/:id",
            element: (
              <ProtectedRoute allowedRole="ADMIN">
                <BoastOne />
              </ProtectedRoute>
            ),
          },

        ],
      },
    ],
  },
]);

export default router;
