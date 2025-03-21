import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HodLayout from "./components/layout/HodLayout";
import ProjectManagerLayout from "./components/layout/ProjectManagerLayout";
import Invite from "./pages/Invite/Invite";
import ViewProject from "./pages/ProjectManager/Project/ViewProject";
import CitizenLayout from "./components/layout/CitizenLayout";

const Loading = () => <div>Loading...</div>;

// HOD imports
const HodDashboard = lazy(() => import("./pages/Hod/Dashboard/Dashboard"));
const HodComplaint = lazy(() => import("./pages/Hod/Complaints/Complaint"));
const HodNotifications = lazy(
  () => import("./pages/Hod/Notifications/Notifications")
);
const Conflict = lazy(() => import("./pages/Hod/Project/Conflict"));
const HodOnboarding = lazy(() => import("./pages/Hod/OnBoarding/Onboarding"));
const HodProject = lazy(() => import("./pages/Hod/Project/Project"));
const ProjectDetails = lazy(() => import("./pages/Hod/Project/ProjectDetails"));
const HodResources = lazy(() => import("./pages/Hod/Resources/Resource"));
const HodTeam = lazy(() => import("./pages/Hod/Team/Team"));
const HodCreateProject = lazy(
  () => import("./pages/Hod/Project/CreateProject")
);
const HodConflict = lazy(() => import("./pages/Hod/Project/Conflict"));
const HodCreateResource = lazy(() => import("./pages/Hod/Resources/Create"));
const HodMarket = lazy(() => import("./pages/Hod/Resources/Market"));
const HodShare = lazy(() => import("./pages/Hod/Resources/Share"));

// Project Manager imports
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
const ProjectCreate = lazy(
  () => import("./pages/ProjectManager/Project/Create")
);

// Citizen imports
const CitizenDashboard = lazy(() =>
  import("./pages/Citizen/Dashboard/Dashboard")
);
const CitizenProject = lazy(() =>
  import("./pages/Citizen/Projects/Project")
);
const CitizenProjectDetails = lazy(() => 
  import("./pages/Citizen/Projects/ProjectDetails")
);
const CitizenComplaint = lazy(() =>
  import("./pages/Citizen/Complaints/Complaint")
);
const CitizenCreateComplaint = lazy(() =>
  import("./pages/Citizen/Complaints/CreateComplaint")
);
const CitizenComplaintDetails = lazy(() =>
  import("./pages/Citizen/Complaints/ComplaintDetails")
);

const router = createBrowserRouter([
  {
    path: "/invite",
    element: <Invite />,
  },
  {
    path: "/hod",
    element: <HodLayout />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <HodDashboard />
          </Suspense>
        ),
      },
      {
        path: "projects",
        element: (
          <Suspense fallback={<Loading />}>
            <HodProject />
          </Suspense>
        ),
      },
      {
        path: "projects/:projectId",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectDetails />
          </Suspense>
        ),
      },
      {
        path: "resources",
        element: (
          <Suspense fallback={<Loading />}>
            <HodResources />
          </Suspense>
        ),
      },
      {
        path: "team",
        element: (
          <Suspense fallback={<Loading />}>
            <HodTeam />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<Loading />}>
            <HodNotifications />
          </Suspense>
        ),
      },
      {
        path: "onboarding",
        element: (
          <Suspense fallback={<Loading />}>
            <HodOnboarding />
          </Suspense>
        ),
      },
      {
        path: "create-project",
        element: (
          <Suspense fallback={<Loading />}>
            <HodCreateProject />
          </Suspense>
        ),
      },
      {
        path: "create-resource",
        element: (
          <Suspense fallback={<Loading />}>
            <HodCreateResource />
          </Suspense>
        ),
      },
      {
        path: "market",
        element: (
          <Suspense fallback={<Loading />}>
            <HodMarket />
          </Suspense>
        ),
      },
      {
        path: "share",
        element: (
          <Suspense fallback={<Loading />}>
            <HodShare />
          </Suspense>
        ),
      },
      {
        path: "conflict",
        element: (
          <Suspense fallback={<Loading />}>
            <HodConflict />
          </Suspense>
        ),
      },
      {
        path: "conflicts/:conflictId",
        element: (
          <Suspense fallback={<Loading />}>
            <Conflict />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/project-manager",
    element: <ProjectManagerLayout />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectManagerDashboard />
          </Suspense>
        ),
      },
      {
        path: "projects",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectManagerProject />
          </Suspense>
        ),
      },
      {
        path: "projects/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <ViewProject />
          </Suspense>
        ),
      },
      {
        path: "projects/create",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectCreate />
          </Suspense>
        ),
      },
      {
        path: "conflicts",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectManagerConflict />
          </Suspense>
        ),
      },
      {
        path: "conflicts/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectManagerConflict />
          </Suspense>
        ),
      },
      {
        path: "resources",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectManagerResources />
          </Suspense>
        ),
      },
      {
        path: "resources/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectManagerResources />
          </Suspense>
        ),
      },
      {
        path: "resources/:id/track",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectManagerResources />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectManagerNotifications />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/citizen",
    element: <CitizenLayout />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <CitizenDashboard />
          </Suspense>
        ),
      },
      {
        path: "projects",
        element: (
          <Suspense fallback={<Loading />}>
            <CitizenProject />
          </Suspense>
        ),
      },
      {
        path: "projects/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <CitizenProjectDetails />
          </Suspense>
        ),
      },
      {
        path: "create-complaints",
        element: (
          <Suspense fallback={<Loading />}>
            <CitizenCreateComplaint />
          </Suspense>
        ),
      },
      {
        path: "complaints/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <CitizenComplaintDetails />
          </Suspense>
        ),
      },
      {
        path: "complaints",
        element: (
          <Suspense fallback={<Loading />}>
            <CitizenComplaint />
          </Suspense>
        ),
      },
    ],
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
