const express = require("express");

const staffController = require("../controllers/staffController");
const authGuard = require("../guards/authGuard");
const roleGuard = require("../guards/roleGuard");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff dashboard and management operations
 */

/**
 * @swagger
 * /api/staff/dashboard:
 *   get:
 *     summary: Get staff dashboard
 *     description: Returns dashboard statistics and today's appointments for authenticated staff users.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Staff dashboard fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized as staff
 */
router.use(authGuard);
router.use(roleGuard("STAFF"));

router.get("/dashboard", staffController.getDashboard);

/**
 * @swagger
 * /api/staff/patients:
 *   get:
 *     summary: Get staff patient list
 *     description: Returns patients with optional search and pagination.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by patient name, phone, or email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of patients per page
 *     responses:
 *       200:
 *         description: Staff patients fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized as staff
 */
router.get("/patients", staffController.getPatients);

/**
 * @swagger
 * /api/staff/patients/{id}:
 *   get:
 *     summary: Get staff patient details
 *     description: Returns a patient's profile and recent appointments.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Staff patient fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized as staff
 *       404:
 *         description: Patient not found
 */
router.get("/patients/:id", staffController.getPatientById);

/**
 * @swagger
 * /api/staff/patients:
 *   post:
 *     summary: Create a patient
 *     description: Creates a patient record for staff-managed patient registration.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1995-06-15
 *               gender:
 *                 type: string
 *                 example: Male
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               address:
 *                 type: string
 *                 example: Hyderabad, Telangana
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Patient name is required
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized as staff
 */
router.post("/patients", staffController.createPatient);

/**
 * @swagger
 * /api/staff/patients/{id}:
 *   put:
 *     summary: Update a patient
 *     description: Updates an existing patient record.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Invalid patient data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized as staff
 *       404:
 *         description: Patient not found
 */
router.put("/patients/:id", staffController.updatePatient);

/**
 * @swagger
 * /api/staff/doctors:
 *   get:
 *     summary: Get staff doctor list
 *     description: Returns doctors with optional search by name or specialty and pagination.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by doctor name or specialty
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Staff doctors fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized as staff
 */
router.get("/doctors", staffController.getDoctors);

/**
 * @swagger
 * /api/staff/doctors/{id}:
 *   get:
 *     summary: Get staff doctor details
 *     description: Returns a doctor's profile and recent appointments.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Staff doctor fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized as staff
 *       404:
 *         description: Doctor not found
 */
router.get("/doctors/:id", staffController.getDoctorById);

/**
 * @swagger
 * /api/staff/doctors:
 *   post:
 *     summary: Create a doctor
 *     description: Creates a doctor record for staff-managed doctor registration.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr. John Smith
 *               specialty:
 *                 type: string
 *                 example: Cardiology
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: doctor@example.com
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *       400:
 *         description: Doctor name is required
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized as staff
 */
router.post("/doctors", staffController.createDoctor);

/**
 * @swagger
 * /api/staff/doctors/{id}:
 *   put:
 *     summary: Update a doctor
 *     description: Updates an existing doctor record.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialty:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       400:
 *         description: Invalid doctor data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized as staff
 *       404:
 *         description: Doctor not found
 */
router.put("/doctors/:id", staffController.updateDoctor);

/**
 * @swagger
 * /api/staff/appointments:
 *   get:
 *     summary: Get staff appointment list
 *     description: Returns appointments with optional date, doctor, status, search, and pagination filters.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter appointments by date
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *         description: Filter by doctor ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - SCHEDULED
 *             - IN_PROGRESS
 *             - COMPLETED
 *             - CANCELLED
 *         description: Filter by appointment status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by patient or doctor name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Staff appointments fetched successfully
 *       400:
 *         description: Invalid filter value
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized as staff
 */
router.get("/appointments", staffController.getAppointments);

/**
 * @swagger
 * /api/staff/appointments:
 *   post:
 *     summary: Create a staff appointment
 *     description: Creates a scheduled appointment for a patient with a doctor. Staff users only.
 *     tags:
 *       - Staff
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - doctorId
 *               - startTime
 *               - endTime
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: "cm123patient"
 *               doctorId:
 *                 type: string
 *                 example: "cm123doctor"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-10-05T10:00:00.000Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-10-05T10:30:00.000Z"
 *               reason:
 *                 type: string
 *                 example: "Routine consultation"
 *               notes:
 *                 type: string
 *                 example: "Patient requested morning appointment"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Invalid appointment data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       404:
 *         description: Patient or doctor not found
 *       409:
 *         description: Doctor has a conflicting appointment
 */
router.post("/appointments", staffController.createAppointment);

/**
 * @swagger
 * /api/staff/appointments/{id}:
 *   put:
 *     summary: Update a staff appointment
 *     description: Updates appointment details, schedule, doctor, patient, status, reason, or notes. Staff users only.
 *     tags:
 *       - Staff
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: "cm123patient"
 *               doctorId:
 *                 type: string
 *                 example: "cm123doctor"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-10-05T11:00:00.000Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-10-05T11:30:00.000Z"
 *               status:
 *                 type: string
 *                 enum:
 *                   - SCHEDULED
 *                   - IN_PROGRESS
 *                   - COMPLETED
 *                   - CANCELLED
 *                 example: "SCHEDULED"
 *               reason:
 *                 type: string
 *                 example: "Follow-up consultation"
 *               notes:
 *                 type: string
 *                 example: "Patient requested afternoon slot"
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       400:
 *         description: Invalid appointment data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       404:
 *         description: Appointment, patient, or doctor not found
 *       409:
 *         description: Doctor has a conflicting appointment
 */
router.put(
  "/appointments/:id",
  staffController.updateAppointment,
);

/**
 * @swagger
 * /api/staff/appointments/{id}:
 *   get:
 *     summary: Get staff appointment details
 *     description: Returns complete appointment details including patient and doctor information.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Staff appointment fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized as staff
 *       404:
 *         description: Appointment not found
 */
router.get(
  "/appointments/:id",
  staffController.getAppointmentById,
);

module.exports = router;
