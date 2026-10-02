import { Navigate, Route, Routes } from "react-router-dom";

import PatientLayout from "@/components/patient/PatientLayout";
import PatientDashboard from "@/pages/patient/PatientDashboard";
import BookAppointment from "@/pages/patient/BookAppointment";
import MyAppointments from "@/pages/patient/MyAppointments";
import MyProfile from "@/pages/patient/MyProfile";

import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import DoctorMyAppointments from "@/pages/doctor/MyAppointments";
import AppointmentDetails from "@/pages/doctor/AppointmentDetails";

import StaffLayout from "@/components/staff/StaffLayout";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import StaffPatients from "@/pages/staff/Patients";
import StaffDoctors from "@/pages/staff/Doctors";
import StaffAppointments from "@/pages/staff/Appointments";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />

      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="book-appointment" element={<BookAppointment />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="profile" element={<MyProfile />} />
      </Route>

      <Route path="/doctor" element={<PatientLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route
          path="appointments"
          element={<DoctorMyAppointments />}
        />
        <Route
          path="appointments/:id"
          element={<AppointmentDetails />}
        />
      </Route>

      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="patients" element={<StaffPatients />} />
        <Route path="doctors" element={<StaffDoctors />} />
        <Route path="appointments" element={<StaffAppointments />} />
      </Route>
    </Routes>
  );
}

export default App;