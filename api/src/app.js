const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const staffRoutes = require("./routes/staffRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.disable("etag");

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Clinic Appointment Management API is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/doctor", doctorRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

module.exports = app;
