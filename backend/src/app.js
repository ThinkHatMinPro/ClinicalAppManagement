const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/authRoutes");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Clinic Appointment Management API is running",
  });
});

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Authentication routes
app.use("/api/auth", authRoutes);

// Global error handler - always keep last
app.use(errorHandler);

module.exports = app;