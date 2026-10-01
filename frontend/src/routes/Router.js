import {
  Navigate,
  Route,
  Routes,
  BookAppointment,
    MyAppointments,
    MyProfile,
} from "react-router-dom";

import PatientLayout from "@/components/patient/PatientLayout";
import PatientDashboard from "@/components/patient/PatientDashboard";

function App() {
  return (
    <Routes>
      <Route path="/patient" element={<PatientLayout />}>
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<PatientDashboard />}
        />
      </Route>
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
    </Routes>
  );
}

export default App;