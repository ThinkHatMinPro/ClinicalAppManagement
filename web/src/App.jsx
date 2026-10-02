import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

<<<<<<< Updated upstream:web/src/App.jsx
import AuthPage from "./pages/auth/AuthPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
<<<<<<< Updated upstream
import AppLayout from "./components/layout/AppLayout";
=======
import AuthPage from "@/pages/AuthPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";

import AppLayout from "@/components/layout/AppLayout";
import PatientLayout from "@/components/layout/PatientLayout";

import PatientDashboard from "@/pages/patient/PatientDashboard";
import BookAppointment from "@/pages/patient/BookAppointment";
import MyAppointments from "@/pages/patient/MyAppointments";
import MyProfile from "@/pages/patient/MyProfile";
>>>>>>> Stashed changes:frontend/src/App.jsx
=======
>>>>>>> Stashed changes

import StaffLayout from "./components/staff/StaffLayout";
import StaffDashboard from "./pages/staff/StaffDashboard";
import Patients from "./pages/staff/Patients";
import Doctors from "./pages/staff/Doctors";
import Appointments from "./pages/staff/Appointments";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< Updated upstream
<<<<<<< Updated upstream:web/src/App.jsx
        
          <Route path="/auth" element={<AuthPage />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route element={<AppLayout />}>
=======
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route path="/patient" element={<PatientLayout />}>
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<PatientDashboard />}
          />

          <Route
            path="book-appointment"
            element={<BookAppointment />}
          />

          <Route
            path="appointments"
            element={<MyAppointments />}
          />

          <Route
            path="profile"
            element={<MyProfile />}
          />
        </Route>

        <Route element={<AppLayout />}>
>>>>>>> Stashed changes:frontend/src/App.jsx
=======
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route path="/staff" element={<StaffLayout />}>
>>>>>>> Stashed changes
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
<<<<<<< Updated upstream
            path="/patients"
            element={<Placeholder title="Patients" />}
          />

<<<<<<< Updated upstream:web/src/App.jsx
          <Route path="/doctors" element={<Placeholder title="Doctors" />} /></Route>
          <Route path="*" element={<Navigate to="/auth" replace />} />
        
        </Routes>
=======
          <Route
            path="/doctors"
            element={<Placeholder title="Doctors" />}
=======
            path="dashboard"
            element={<StaffDashboard />}
          />

          <Route
            path="patients"
            element={<Patients />}
          />

          <Route
            path="doctors"
            element={<Doctors />}
          />

          <Route
            path="appointments"
            element={<Appointments />}
>>>>>>> Stashed changes
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/auth" replace />}
        />
      </Routes>
<<<<<<< Updated upstream
>>>>>>> Stashed changes:frontend/src/App.jsx
=======
>>>>>>> Stashed changes
    </BrowserRouter>
  );
}