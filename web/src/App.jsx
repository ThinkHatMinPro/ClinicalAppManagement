import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthPage from "@/pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AppLayout from "@/components/layout/AppLayout";

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
        {/* Authentication */}
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Application */}
        <Route element={<AppLayout />}>
          <Route
            path="/appointments"
            element={<Placeholder title="Appointments" />}
          />

          <Route path="/patients" element={<Placeholder title="Patients" />} />

          <Route path="/doctors" element={<Placeholder title="Doctors" />} />
        </Route>

        {/* Default route */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
