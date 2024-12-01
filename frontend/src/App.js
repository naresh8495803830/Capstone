import "./App.css";
import Login from "./components/admin/pages/login/Login";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Dashboard from "./components/dashboard/pages/Dashboard";
import Npsresponse from "./components/forms/pages/Npsresponse";
import NpsForm from "./components/forms/pages/NpsForm";
import DomainForm from "./components/forms/pages/DomainForm";
import ProgramForm from "./components/forms/pages/ProgramForm";
import BatchForm from "./components/forms/pages/BatchForm";
import UserForm from "./components/forms/pages/UserForm";
import Npsresult from "./components/npsresult/Npsresult";
import Studentlist from "./components/forms/pages/Studentlist";
import Statics from "./components/dashboard/pages/Statics";
import NpsRegisterForm from "./components/forms/pages/NpsRegisterForm";
import UserResponse from "./components/dashboard/pages/UserResponse";
import Batchwisechart from "./components/dashboard/pages/Batchwisechart";
import ProtectedRoute from "./utils/protectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";

const router = createBrowserRouter([
  {
    //no authentication required
    path: "/",
    element: <Login></Login>,
  },
  {
    //no authentication required
    path: "npsresponse/:userId",
    element: <Npsresponse></Npsresponse>,
  },

  {
    path: "dashboard",
    element: <ProtectedRoute element={Dashboard} />,
  },
  {
    path: "npsform",
    element: <ProtectedRoute element={NpsForm} />,
  },
  {
    path: "domain",
    element: <ProtectedRoute element={DomainForm} />,
  },
  {
    path: "program",
    element: <ProtectedRoute element={ProgramForm} />,
  },
  {
    path: "batch",
    element: <ProtectedRoute element={BatchForm} />,
  },
  {
    path: "users",
    element: <ProtectedRoute element={UserForm} />,
  },
  {
    path: "npsresult",
    element: <ProtectedRoute element={Npsresult} />,
  },
  {
    path: "studentlist",
    element: <ProtectedRoute element={Studentlist} />,
  },
  {
    path: "statics",
    element: <ProtectedRoute element={Statics} />,
  },
  {
    path: "npsregisterform",
    element: <ProtectedRoute element={NpsRegisterForm} />,
  },
  {
    path: "userresponse/:responseId",
    element: <ProtectedRoute element={UserResponse} />,
  },
  {
    path: "batchwise",
    element: <ProtectedRoute element={Batchwisechart} />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  );
}

export default App;
