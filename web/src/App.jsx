import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

// ============================================================
// AUTH
// ============================================================

import AuthPage from "./pages/Auth/AuthPage";

// ============================================================
// STAFF LAYOUT
// ============================================================

import StaffLayout from "./components/staff/StaffLayout";

// ============================================================
// STAFF DASHBOARD
// ============================================================

import StaffDashboard from "./pages/staff/StaffDashboard";

// ============================================================
// PATIENTS
// ============================================================

import Patients from "./pages/staff/Patients";
import PatientForm from "./pages/staff/PatientForm";
import PatientDetails from "./pages/staff/PatientDetails";

// ============================================================
// DOCTORS
// ============================================================

import Doctors from "./pages/staff/Doctors";
import DoctorForm from "./pages/staff/DoctorForm";
import DoctorDetails from "./pages/staff/DoctorDetails";

// ============================================================
// APPOINTMENTS
// ============================================================

import Appointments from "./pages/staff/Appointments";
import AppointmentForm from "./pages/staff/AppointmentForm";
import StaffAppointmentDetails from "./pages/staff/AppointmentDetails";

// ============================================================
// APP
// ============================================================

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ================================================= */}
                {/* ROOT */}
                {/* ================================================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/auth"
                            replace
                        />
                    }
                />

                {/* ================================================= */}
                {/* AUTH */}
                {/* ================================================= */}

                <Route
                    path="/auth"
                    element={<AuthPage />}
                />

                {/* ================================================= */}
                {/* STAFF PORTAL */}
                {/* ================================================= */}

                <Route
                    path="/staff"
                    element={<StaffLayout />}
                >
                    {/* Default staff route */}

                    <Route
                        index
                        element={
                            <Navigate
                                to="dashboard"
                                replace
                            />
                        }
                    />

                    {/* ============================================= */}
                    {/* DASHBOARD */}
                    {/* ============================================= */}

                    <Route
                        path="dashboard"
                        element={<StaffDashboard />}
                    />

                    {/* ============================================= */}
                    {/* PATIENTS */}
                    {/* ============================================= */}

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

                    {/* ============================================= */}
                    {/* DOCTORS */}
                    {/* ============================================= */}

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

                    {/* ============================================= */}
                    {/* APPOINTMENTS */}
                    {/* ============================================= */}

                    {/* Appointment List */}

                    <Route
                        path="appointments"
                        element={<Appointments />}
                    />

                    {/* Create Appointment */}

                    <Route
                        path="appointments/new"
                        element={<AppointmentForm />}
                    />

                    {/* Appointment Details */}

                    <Route
                        path="appointments/:id"
                        element={
                            <StaffAppointmentDetails />
                        }
                    />
                </Route>

                {/* ================================================= */}
                {/* NOT FOUND */}
                {/* ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/auth"
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;