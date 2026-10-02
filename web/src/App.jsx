import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import StaffLayout from "./components/staff/StaffLayout";
import AuthPage from "./pages/auth/AuthPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AppLayout from "./components/layout/AppLayout";

import PatientLayout from "@/components/layout/PatientLayout";
import PatientDashboard from "@/pages/patient/PatientDashboard";
import BookAppointment from "@/pages/patient/BookAppointment";
import MyAppointments from "@/pages/patient/MyAppointments";
import MyProfile from "@/pages/patient/MyProfile";

import StaffDashboard from "./pages/staff/StaffDashboard";
import Patients from "./pages/staff/Patients";
import PatientForm from "./pages/staff/PatientForm";
import PatientDetails from "./pages/staff/PatientDetails";
import Doctors from "./pages/staff/Doctors";
import DoctorForm from "./pages/staff/DoctorForm";
import DoctorDetails from "./pages/staff/DoctorDetails";
import Appointments from "./pages/staff/Appointments";
import AppointmentForm from "./pages/staff/AppointmentForm";
import AppointmentDetails from "./pages/staff/AppointmentDetails";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
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
<Route path="/staff" element={<StaffLayout />}>
    <Route
        index
        element={<Navigate to="dashboard" replace />}
    />

    <Route
        path="dashboard"
        element={<StaffDashboard />}
    />

    <Route
        path="patients"
        element={<Patients />}
    />

    <Route
        path="patients/new"
        element={<PatientForm />}
    />

    <Route
        path="patients/:id"
        element={<PatientDetails />}
    />

    <Route
        path="doctors"
        element={<Doctors />}
    />

    <Route
        path="doctors/new"
        element={<DoctorForm />}
    />

    <Route
        path="doctors/:id"
        element={<DoctorDetails />}
    />

    <Route
        path="appointments"
        element={<Appointments />}
    />

    <Route
        path="appointments/new"
        element={<AppointmentForm />}
    />

    <Route
        path="appointments/:id"
        element={<AppointmentDetails />}
    />
</Route>
            </Routes>
        </BrowserRouter>
    );
}