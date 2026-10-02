const express = require("express");

const patientController = require("../controllers/patientController");
const authGuard = require("../guards/authGuard");
const roleGuard = require("../guards/roleGuard");

const router = express.Router();

router.use(authGuard);
router.use(roleGuard("PATIENT"));

/**
 * @swagger
 * /api/patient/dashboard:
 *   get:
 *     summary: Get patient dashboard
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient dashboard fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/dashboard", patientController.getDashboard);

/**
 * @swagger
 * /api/patient/profile:
 *   get:
 *     summary: Get logged-in patient profile
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient profile fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Patient profile not found
 */
router.get("/profile", patientController.getProfile);

/**
 * @swagger
 * /api/patient/profile:
 *   put:
 *     summary: Update logged-in patient profile
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Patient
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1998-05-15
 *               gender:
 *                 type: string
 *                 example: Male
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               email:
 *                 type: string
 *                 example: patient@example.com
 *               address:
 *                 type: string
 *                 example: Hyderabad, Telangana
 *     responses:
 *       200:
 *         description: Patient profile updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Patient profile not found
 */
router.put("/profile", patientController.updateProfile);

/**
 * @swagger
 * /api/patient/doctors:
 *   get:
 *     summary: Get available doctors
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctors fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/doctors", patientController.getDoctors);

/**
 * @swagger
 * /api/patient/doctors/{doctorId}/available-slots:
 *   get:
 *     summary: Get doctor availability for a date
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-10-05
 *     responses:
 *       200:
 *         description: Doctor availability fetched successfully
 *       400:
 *         description: Date is required or invalid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Doctor not found
 */
router.get(
  "/doctors/:doctorId/available-slots",
  patientController.getDoctorAvailableSlots,
);

/**
 * @swagger
 * /api/patient/appointments:
 *   post:
 *     summary: Book an appointment
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - startTime
 *               - endTime
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: cm123doctor
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-05T10:00:00.000Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-05T10:30:00.000Z
 *               reason:
 *                 type: string
 *                 example: General consultation
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Invalid appointment details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Doctor or patient not found
 *       409:
 *         description: Appointment time conflict
 */
router.post("/appointments", patientController.bookAppointment);

/**
 * @swagger
 * /api/patient/appointments:
 *   get:
 *     summary: Get logged-in patient appointments
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointments fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/appointments", patientController.getAppointments);

/**
 * @swagger
 * /api/patient/appointments/{id}:
 *   get:
 *     summary: Get appointment details
 *     tags:
 *       - Patient
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
 *         description: Appointment fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 */
router.get("/appointments/:id", patientController.getAppointmentById);

/**
 * @swagger
 * /api/patient/appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel an appointment
 *     tags:
 *       - Patient
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
 *         description: Appointment cancelled successfully
 *       400:
 *         description: Appointment cannot be cancelled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 */
router.patch("/appointments/:id/cancel", patientController.cancelAppointment);

module.exports = router;