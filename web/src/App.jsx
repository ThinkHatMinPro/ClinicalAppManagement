import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import AppLayout from "@/components/layout/AppLayout";
import SignupPage from "@/pages/SignupPage";

// Temporary: each of these is replaced by a real page in its own phase.
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route element={<AppLayout />}>
          <Route
            path="/appointments"
            element={<Placeholder title="Appointments" />}
          />
          <Route path="/patients" element={<Placeholder title="Patients" />} />
          <Route path="/doctors" element={<Placeholder title="Doctors" />} />
        </Route>

        <Route path="*" element={<Navigate to="/appointments" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
