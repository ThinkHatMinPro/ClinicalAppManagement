import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthPage from "./pages/auth/AuthPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AppLayout from "./components/layout/AppLayout";

import PatientLayout from "@/components/layout/PatientLayout";
import PatientDashboard from "@/pages/patient/PatientDashboard";
import BookAppointment from "@/pages/patient/BookAppointment";
import MyAppointments from "@/pages/patient/MyAppointments";
import MyProfile from "@/pages/patient/MyProfile";

// Doctor
import DoctorLayout from "@/components/doctor/DoctorLayout";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import DoctorAppointments from "@/pages/doctor/MyAppointments";
import AppointmentDetails from "@/pages/doctor/AppointmentDetails";

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

                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />

                {/* Existing application routes */}
                <Route element={<AppLayout />}>
                    <Route
                        path="/appointments"
                        element={<Placeholder title="Appointments" />}
                    />

                    <Route
                        path="/patients"
                        element={<Placeholder title="Patients" />}
                    />

                    <Route
                        path="/doctors"
                        element={<Placeholder title="Doctors" />}
                    />
                </Route>

                {/* Patient Portal */}
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

                {/* Doctor Portal */}
                <Route path="/doctor" element={<DoctorLayout />}>
                    <Route
                        index
                        element={<Navigate to="dashboard" replace />}
                    />

                    <Route
                        path="dashboard"
                        element={<DoctorDashboard />}
                    />

                    <Route
                        path="appointments"
                        element={<DoctorAppointments />}
                    />

                    <Route
                        path="appointments/:id"
                        element={<AppointmentDetails />}
                    />
                </Route>

                {/* Fallback */}
                <Route
                    path="*"
                    element={<Navigate to="/auth" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}