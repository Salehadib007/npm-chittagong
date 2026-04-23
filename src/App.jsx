import { Outlet } from "react-router-dom";
import Navbar from "./component/Navbar";
import PsudoApp from "./PsudoApp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import App from "./App";
import Home from "./component/Home";
import Customer from "./component/operation/Customer";
import Rank from "./component/setup/Rank";
import VehicleBrand from "./component/setup/VehicleBrand";
import UserCategory from "./component/setup/UserCategory";
import JobLocation from "./component/setup/JobLocation";
import BrtaLocation from "./component/setup/BrtaLocation";
import BrtaDigit from "./component/setup/BrtaDigit";
import BloodGroup from "./component/setup/BloodGroup";
import VehicleModel from "./component/setup/VehicleModel";
import Employee from "./component/setup/Employee";
import Branch from "./component/setup/Branch";
import Department from "./component/setup/Department";
import Designation from "./component/setup/Designation";

import { getAccess } from "../utils/auth";

import Login from "./component/admin/Login";
import MenuDistribution from "./component/admin/MenuDistribution";
import Register from "./component/admin/Register";
import CustomerEntry from "./component/operation/CustomerEntry";
import "./index.css";
import { SetupProvider, useSetup } from "../context/SetupContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import AutoQRCode from "./component/admin/AutoCode";
import VehiclePass from "./component/admin/VehiclePass";
import EnrollmentDetails from "./component/operation/EnrollmentDetails";
import AddRegistrationOptions from "./component/setup/AddRegistrationOptions";
import VehicleTable from "./component/setup/VehicleTable";
import VehicleDetails from "./component/setup/VehicleDetails";
import VehicleType from "./component/setup/VehicleType";
import Report from "./component/Report";
import EnrollmentProfileView from "./component/admin/EnrollmentProfileView";

const App = () => {
  const { auth } = useAuth();

  // console.log("this is access" + access);

  const can = (permission) => auth?.user?.access?.includes(permission);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PsudoApp />,
      children: [
        {
          index: true,
          element: (
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          ),
        },

        // OPERATION
        {
          path: "enrollment",
          element: can("Enrollment") && <Customer></Customer>,
        },
        {
          path: "customerEntry",
          element: can("Enrollment") && <CustomerEntry></CustomerEntry>,
        },
        {
          path: "enrollment-details",
          element: can("Enrollment") && <EnrollmentDetails></EnrollmentDetails>,
        },

        // SETUP
        { path: "branch", element: can("Setup.Branch") && <Branch /> },
        { path: "rank", element: can("Setup.Rank") && <Rank></Rank> },
        {
          path: "vehicle-brand",
          element: can("Setup.VehicleBrand") && <VehicleBrand />,
        },
        {
          path: "user-category",
          element: can("Setup.UserCategory") && <UserCategory />,
        },
        {
          path: "job-location",
          element: can("Setup.JobLocation") && <JobLocation />,
        },
        {
          path: "brta-location",
          element: can("Setup.BRTALocation") && <BrtaLocation />,
        },
        {
          path: "brta-digit",
          element: can("Setup.BRTADigit") && <BrtaDigit />,
        },
        {
          path: "blood-group",
          element: can("Setup.BloodGroup") && <BloodGroup />,
        },
        {
          path: "vehicle-model",
          element: <VehicleModel />,
        },
        {
          path: "vehicle-type",
          element: <VehicleType />,
        },
        {
          path: "vehicle-model",
          element: <VehicleModel />,
        },
        { path: "employee", element: can("Setup.Employee") && <Employee /> },
        {
          path: "department",
          element: can("Setup.Department") && <Department />,
        },
        {
          path: "designation",
          element: can("Setup.Designation") && <Designation />,
        },
        {
          path: "add-registration",
          element: <AddRegistrationOptions />,
        },

        // // REPORT / ADMIN
        {
          path: "register",
          element: can("CreateUser") && <Register></Register>,
        },
        { path: "report", element: <Report /> },
        { path: "vehicle-table", element: <VehicleTable /> },
        { path: "vehicle-details", element: <VehicleDetails /> },

        {
          path: "enrollment-list",
          element: can("Enrollment") && <AutoQRCode />,
        },
        {
          path: "permit/:enrollmentId",
          element: <EnrollmentProfileView />,
        },
        {
          path: "show-data/:id",
          element: <VehiclePass />,
        },
        {
          path: "menu-distribution",
          element: can("MenuDistribution") && (
            <MenuDistribution></MenuDistribution>
          ),
        },
        {
          path: "login",
          element: <Login></Login>,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
