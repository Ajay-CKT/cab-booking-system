import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
// import App from "./App";
import Home from "./Home";
import LoginToRide from "./pages/LoginToRide";
import LoginToDrive from "./pages/LoginToDrive";
import SignupToRide from "./pages/SignupToRide";
import SignupToDrive from "./pages/SignupToDrive";
import PassengerDashboard from "./pages/PassengerDashboard";
import DriverDashboard from "./pages/DriverDasboard";
import AdminDashboard from "./pages/AdminDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login-ride",
    element: <LoginToRide />,
  },
  {
    path: "/login-drive",
    element: <LoginToDrive />,
  },
  {
    path: "/signup-ride",
    element: <SignupToRide />,
  },
  {
    path: "signup-drive",
    element: <SignupToDrive />,
  },
  {
    path: "/passenger-dashboard",
    element: <PassengerDashboard />,
  },
  {
    path: "/driver-dashboard",
    element: <DriverDashboard />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  // {
  //   path: "/app",
  //   element: <App />,
  // },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
