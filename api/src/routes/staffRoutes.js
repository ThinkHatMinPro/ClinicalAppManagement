const express = require("express");

const staffController = require("../controllers/staffController");

const authGuard = require("../guards/authGuard");
const roleGuard = require("../guards/roleGuard");

const router = express.Router();


// ============================================================
// AUTHENTICATION + STAFF AUTHORIZATION
// ============================================================

router.use(authGuard);
router.use(roleGuard("STAFF"));


// ============================================================
// DASHBOARD
// ============================================================

router.get(
    "/dashboard",
    staffController.getDashboard
);


// ============================================================
// PATIENTS
// ============================================================

// Get all patients
router.get(
    "/patients",
    staffController.getPatients
);

// Get patient by ID
router.get(
    "/patients/:id",
    staffController.getPatientById
);

// Create patient
router.post(
    "/patients",
    staffController.createPatient
);

// Update patient
router.put(
    "/patients/:id",
    staffController.updatePatient
);


// ============================================================
// DOCTORS
// ============================================================

// Get all doctors
router.get(
    "/doctors",
    staffController.getDoctors
);

// Get doctor by ID
router.get(
    "/doctors/:id",
    staffController.getDoctorById
);

// Create doctor
router.post(
    "/doctors",
    staffController.createDoctor
);

// Update doctor
router.put(
    "/doctors/:id",
    staffController.updateDoctor
);


// ============================================================
// APPOINTMENTS
// ============================================================

// Get all appointments
router.get(
    "/appointments",
    staffController.getAppointments
);

// Create appointment
router.post(
    "/appointments",
    staffController.createAppointment
);

// IMPORTANT:
// Keep /appointments/:id for both update and details.
// staffController reads req.params.id.

// Update appointment
router.put(
    "/appointments/:id",
    staffController.updateAppointment
);

// Get appointment details by ID
router.get(
    "/appointments/:id",
    staffController.getAppointmentById
);


// ============================================================
// EXPORT ROUTER
// ============================================================

// IMPORTANT:
// Export router DIRECTLY.
// Do not use module.exports = { router };

module.exports = router;