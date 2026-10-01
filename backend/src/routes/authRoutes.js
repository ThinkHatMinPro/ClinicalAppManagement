const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Receptionist User
 *               email:
 *                 type: string
 *                 format: email
 *                 example: receptionist@clinic.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Reception@123
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - RECEPTIONIST
 *                   - DOCTOR
 *                 example: RECEPTIONIST
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request
 *       409:
 *         description: Email already registered
 */
router.post("/signup", authController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: receptionist@clinic.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Reception@123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Account is inactive
 */
router.post("/login", authController.login);

module.exports = router;