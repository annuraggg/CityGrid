import { Suspense, lazy, useEffect } from "react";
import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";

import HodLayout from "./components/layout/HodLayout";

//hod imports
const HodDashboard = lazy(() => import("./pages/Hod/Dashboard/Dashboard"));
const HodComplaint = lazy(() => import("./pages/Hod/Complaints/Complaint"));
const HodNotifications = lazy(
  () => import("./pages/Hod/Notifications/Notifications")
);
const HodOnboarding = lazy(() => import("./pages/Hod/OnBoarding/Onboarding"));
const HodProject = lazy(() => import("./pages/Hod/Project/Project"));
const HodResources = lazy(() => import("./pages/Hod/Resources/Resource"));
const HodTeam = lazy(() => import("./pages/Hod/Team/Team"));
const HodCreateProject = lazy(
  () => import("./pages/Hod/Project/CreateProject")
);
const HodConflict = lazy(() => import("./pages/Hod/Project/Conflict"));
const HodCreateResource = lazy(() => import("./pages/Hod/Resources/Create"));
const HodMarket = lazy(() => import("./pages/Hod/Resources/Market"));
const HodShare = lazy(() => import("./pages/Hod/Resources/Share"));

//projectmanager imports
const ProjectManagerDashboard = lazy(
  () => import("./pages/ProjectManager/Dashboard/Dashboard")
);
const ProjectManagerNotifications = lazy(
  () => import("./pages/ProjectManager/Notifications/Notifications")
);
const ProjectManagerProject = lazy(
  () => import("./pages/ProjectManager/Project/Project")
);
const ProjectManagerSetup = lazy(
  () => import("./pages/ProjectManager/Project/Setup")
);
const ProjectManagerConflict = lazy(
  () => import("./pages/ProjectManager/Project/Conflict")
);
const ProjectManagerResources = lazy(
  () => import("./pages/ProjectManager/Resources/Resources")
);

const router = createBrowserRouter([
  {
    path: "/hod",
    element: <HodLayout />,
    children: [
      {
        path: "",
        element: <HodDashboard />,
      },
      {
        path: "projects",
        element: <HodProject />,
      },
      {
        path: "resources",
        element: <HodResources />,
      },
      {
        path: "team",
        element: <HodTeam />,
      },
      {
        path: "notifications",
        element: <HodNotifications />,
      },
      {
        path: "onboarding",
        element: <HodOnboarding />,
      },
      {
        path: "create-project",
        element: <HodCreateProject />,
      },
      {
        path: "create-resource",
        element: <HodCreateResource />,
      },
      {
        path: "market",
        element: <HodMarket />,
      },
      {
        path: "share",
        element: <HodShare />,
      },
      {
        path: "conflict",
        element: <HodConflict />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
