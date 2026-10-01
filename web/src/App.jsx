import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

<<<<<<< Updated upstream:web/src/App.jsx
import AuthPage from "./pages/auth/AuthPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
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

function Placeholder({ title }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>

      <p className="mt-2 text-muted-foreground">
        This page will be built in a later phase.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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
          <Route
            path="/appointments"
            element={<Placeholder title="Appointments" />} />

          <Route
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
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/auth" replace />}
        />
      </Routes>
>>>>>>> Stashed changes:frontend/src/App.jsx
    </BrowserRouter>
  );
}