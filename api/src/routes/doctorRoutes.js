const express = require("express");

const doctorController = require("../controllers/doctorController");
const authGuard = require("../guards/authGuard");
const roleGuard = require("../guards/roleGuard");

const router = express.Router();

router.use(authGuard);
router.use(roleGuard("DOCTOR"));

router.get("/profile", doctorController.getProfile);

router.get(
  "/appointments",
  doctorController.getAppointments
);

router.get(
  "/appointments/:id",
  doctorController.getAppointmentById
);

router.patch(
  "/appointments/:id/status",
  doctorController.updateAppointmentStatus
);

module.exports = router;