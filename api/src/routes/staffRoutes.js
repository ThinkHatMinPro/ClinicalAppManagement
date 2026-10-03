const express = require("express");

const staffController = require("../controllers/staffController");
const authGuard = require("../guards/authGuard");
const roleGuard = require("../guards/roleGuard");

const router = express.Router();

router.use(authGuard);
router.use(roleGuard("STAFF"));

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff-only patient, doctor, and appointment management
 */

/**
 * @swagger
 * /staff/dashboard:
 *   get:
 *     summary: Get staff dashboard
 *     description: Returns dashboard statistics and summary information for authenticated staff users.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Staff dashboard data retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 */
router.get("/dashboard", staffController.getDashboard);

/**
 * @swagger
 * /staff/patients:
 *   get:
 *     summary: Get all patients
 *     description: Returns a list of patients accessible to staff users.
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 */
router.get("/patients", staffController.getPatients);

/**
 * @swagger
 * /staff/patients/{id}:
 *   get:
 *     summary: Get patient by ID
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
 *         description: Patient retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       404:
 *         description: Patient not found
 */
router.get("/patients/:id", staffController.getPatientById);

/**
 * @swagger
 * /staff/patients:
 *   post:
 *     summary: Create a patient
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
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1995-05-15"
 *               gender:
 *                 type: string
 *                 example: MALE
 *               address:
 *                 type: string
 *                 example: Hyderabad
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Invalid patient data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       409:
 *         description: Patient already exists
 */
router.post("/patients", staffController.createPatient);

/**
 * @swagger
 * /staff/patients/{id}:
 *   put:
 *     summary: Update a patient
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
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
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
 *         description: Staff role required
 *       404:
 *         description: Patient not found
 */
router.put("/patients/:id", staffController.updatePatient);

/**
 * @swagger
 * /staff/patients/{id}:
 *   delete:
 *     summary: Delete a patient
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
 *         description: Patient deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       404:
 *         description: Patient not found
 */
router.delete("/patients/:id", staffController.deletePatient);

/**
 * @swagger
 * /staff/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctors retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 */
router.get("/doctors", staffController.getDoctors);

/**
 * @swagger
 * /staff/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
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
 *         description: Doctor retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       404:
 *         description: Doctor not found
 */
router.get("/doctors/:id", staffController.getDoctorById);

/**
 * @swagger
 * /staff/doctors:
 *   post:
 *     summary: Create a doctor
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
 *               - email
 *               - specialty
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr. John Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: doctor@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               specialty:
 *                 type: string
 *                 example: Cardiology
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *       400:
 *         description: Invalid doctor data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       409:
 *         description: Doctor already exists
 */
router.post("/doctors", staffController.createDoctor);

/**
 * @swagger
 * /staff/doctors/{id}:
 *   put:
 *     summary: Update a doctor
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
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               specialty:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       400:
 *         description: Invalid doctor data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       404:
 *         description: Doctor not found
 */
router.put("/doctors/:id", staffController.updateDoctor);

/**
 * @swagger
 * /staff/doctors/{id}:
 *   delete:
 *     summary: Delete a doctor
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
 *         description: Doctor deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       404:
 *         description: Doctor not found
 */
router.delete("/doctors/:id", staffController.deleteDoctor);

/**
 * @swagger
 * /staff/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 */
router.get("/appointments", staffController.getAppointments);

/**
 * @swagger
 * /staff/appointments:
 *   post:
 *     summary: Create an appointment
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: patient-id
 *               doctorId:
 *                 type: string
 *                 example: doctor-id
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-10-05T10:00:00.000Z"
 *               reason:
 *                 type: string
 *                 example: General consultation
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Invalid appointment data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       409:
 *         description: Appointment conflict
 */
router.post("/appointments", staffController.createAppointment);

/**
 * @swagger
 * /staff/appointments/{id}:
 *   put:
 *     summary: Update an appointment
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 example: CONFIRMED
 *               reason:
 *                 type: string
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
 *         description: Appointment not found
 *       409:
 *         description: Appointment conflict
 */
router.put("/appointments/:id", staffController.updateAppointment);

/**
 * @swagger
 * /staff/appointments/{id}:
 *   get:
 *     summary: Get appointment details by ID
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
 *         description: Appointment details retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       404:
 *         description: Appointment not found
 */
router.get("/appointments/:id", staffController.getAppointmentById);

/**
 * @swagger
 * /staff/appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
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
 *         description: Appointment deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Staff role required
 *       404:
 *         description: Appointment not found
 */
router.delete("/appointments/:id", staffController.deleteAppointment);

module.exports = router;
