import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthPage from "./pages/auth/AuthPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AppLayout from "./components/layout/AppLayout";

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
        
          <Route path="/auth" element={<AuthPage />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route element={<AppLayout />}>
          <Route
            path="/appointments"
            element={<Placeholder title="Appointments" />} />

          <Route path="/patients" element={<Placeholder title="Patients" />} />

          <Route path="/doctors" element={<Placeholder title="Doctors" />} /></Route>
          <Route path="*" element={<Navigate to="/auth" replace />} />
        
        </Routes>
    </BrowserRouter>
  );
}
