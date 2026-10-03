const express = require("express");

const doctorController = require("../controllers/doctorController");
const authGuard = require("../guards/authGuard");
const roleGuard = require("../guards/roleGuard");

const router = express.Router();

router.use(authGuard);
router.use(roleGuard("DOCTOR"));

/**
 * @swagger
 * /api/doctor/dashboard:
 *   get:
 *     summary: Get doctor dashboard
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor dashboard fetched successfully
 */
router.get("/dashboard", doctorController.getDashboard);

/**
 * @swagger
 * /api/doctor/profile:
 *   get:
 *     summary: Get doctor profile
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile fetched successfully
 */
router.get("/profile", doctorController.getProfile);

/**
 * @swagger
 * /api/doctor/profile:
 *   put:
 *     summary: Update doctor profile
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile updated successfully
 */
router.put("/profile", doctorController.updateProfile);

/**
 * @swagger
 * /api/doctor/appointments:
 *   get:
 *     summary: Get doctor appointments
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor appointments fetched successfully
 */
router.get("/appointments", doctorController.getAppointments);

/**
 * @swagger
 * /api/doctor/appointments/{id}:
 *   get:
 *     summary: Get appointment details
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment fetched successfully
 */
router.get(
  "/appointments/:id",
  doctorController.getAppointmentById
);

/**
 * @swagger
 * /api/doctor/appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - SCHEDULED
 *                   - IN_PROGRESS
 *                   - COMPLETED
 *                   - CANCELLED
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
 */
router.patch(
  "/appointments/:id/status",
  doctorController.updateAppointmentStatus
);

module.exports = router;