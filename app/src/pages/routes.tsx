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
          { path: "enrollments", element: <Enrollments /> },
          { path: "coupons", element: <Coupons /> },
          { path: "members", element: <Members /> },
          { path: "equip", element: <Equip /> },
          { path: "settings", element: <Settings /> },
          {
            path: "boast",
            element: <Boast />,
          },
          {
            path: "boast/:id",
            element: <BoastOne />,
          },

        ],
      },
    ],
  },
]);

export default router;
