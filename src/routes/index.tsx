import { Navigate } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import SignInSide from "../pages/Auth/SignInSide";
import SignUp from "../pages/Auth/SignUp";
import Dashboard from "../pages/Dashboard/Dashboard";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import AllOrders from "../pages/Orders/AllOrders";
import PatientList from "../pages/PatientInfo/PatientList";
import { mockPatientData } from "../mockData";
import PatientInfo from "../pages/PatientInfo/PatientInfo";
import DoctorList from "../pages/Profile/DoctorList";
import Appointments from "../pages/Appointments/Appointments";
import Calender from "../pages/Calender/Calender";
import Kanban from "../pages/Kanban/Kanban";
import Settings from "../pages/Settings/Settings";
import Account from "../pages/Account/Account";
import Profile from "../pages/Profile/Profile";

const USER_TYPES = {
    NORMAL_USER: "Normal User",
    ADMIN_USER: "Admin User"
  };
  

const CURRENT_USER_TYPE = USER_TYPES.ADMIN_USER;

const AdminElement = ({ children }: any) => {
    if (CURRENT_USER_TYPE === USER_TYPES.ADMIN_USER) {
        return <>{children}</>;
    } else {
        return <Navigate to={"/"} />;
    }
};


export const authRoutes = [
    {
        path: "/",
        element: <SignInSide />,
        errorElement: <ErrorPage />
      },
    {
        path: "/login",
        element: <SignInSide />,

    },
    {
        path: "/register",
        element: <SignUp />,

    },
    {
        path: "/forgot",
        element: <ForgotPassword />
      },
]

export const openRoutes = [];


export const protectedRoutes = [
    {
        path: "/dashboard",
        element: <AdminElement>
            <Dashboard />
        </AdminElement>,
    },
    {
        path: "/orders",
        element: (
          <AdminElement>
            <AllOrders />
          </AdminElement>
        )
      },

      {
        path: "/profile",
        element: (
          <AdminElement>
            <Profile />
          </AdminElement>
        )
      },
      {
        path: "/patient-info/:id",
        element: (
          <AdminElement>
            <PatientInfo patients={mockPatientData} />
          </AdminElement>
        )
      },
      {
        path: "/patient-list",
        element: (
          <AdminElement>
            <PatientList data={mockPatientData} />
          </AdminElement>
        )
      },
      {
        path: "/doctor-list",
        element: (
          <AdminElement>
            <DoctorList/>
          </AdminElement>
        )
      },
      {
        path: "/appointments",
        element: (
          <AdminElement>
            <Appointments />
          </AdminElement>
        )
      },
      {
        path: "/calender",
        element: (
          <AdminElement>
            <Calender />
          </AdminElement>
        )
      },
      {
        path: "/kanban",
        element: (
          <AdminElement>
            <Kanban />
          </AdminElement>
        )
      },
      {
        path: "/account",
        element: (
          <AdminElement>
            <Account />
          </AdminElement>
        )
      },
      {
        path: "/settings",
        element: (
          <AdminElement>
            <Settings />
          </AdminElement>
        )
      }

]