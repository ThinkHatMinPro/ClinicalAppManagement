const staffService = require("../services/staffService");


// ============================================================
// RESPONSE HELPER
// ============================================================

const sendSuccess = (res, message, data, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};


// ============================================================
// DASHBOARD
// ============================================================

const getDashboard = async (req, res, next) => {
    try {
        const data = await staffService.getDashboard();

        return sendSuccess(
            res,
            "Staff dashboard fetched successfully",
            data
        );
    } catch (error) {
        next(error);
    }
};


// ============================================================
// PATIENTS
// ============================================================

const getPatients = async (req, res, next) => {
    try {
        const data = await staffService.getPatients({
            search: req.query.search,
            page: req.query.page,
            limit: req.query.limit,
        });

        return sendSuccess(
            res,
            "Staff patients fetched successfully",
            data
        );
    } catch (error) {
        next(error);
    }
};


const getPatientById = async (req, res, next) => {
    try {
        const patientId = req.params.id;

        if (
            !patientId ||
            patientId === "undefined" ||
            patientId === "null"
        ) {
            const error = new Error("Invalid patient ID");
            error.statusCode = 400;
            throw error;
        }

        const data = await staffService.getPatientById(patientId);

        return sendSuccess(
            res,
            "Staff patient fetched successfully",
            data
        );
    } catch (error) {
        next(error);
    }
};


const createPatient = async (req, res, next) => {
    try {
        const data = await staffService.createPatient(req.body);

        return sendSuccess(
            res,
            "Patient created successfully",
            data,
            201
        );
    } catch (error) {
        next(error);
    }
};


const updatePatient = async (req, res, next) => {
    try {
        const patientId = req.params.id;

        if (
            !patientId ||
            patientId === "undefined" ||
            patientId === "null"
        ) {
            const error = new Error("Invalid patient ID");
            error.statusCode = 400;
            throw error;
        }

        const data = await staffService.updatePatient(
            patientId,
            req.body
        );

        return sendSuccess(
            res,
            "Patient updated successfully",
            data
        );
    } catch (error) {
        next(error);
    }
};


// ============================================================
// DOCTORS
// ============================================================

const getDoctors = async (req, res, next) => {
    try {
        const data = await staffService.getDoctors({
            search: req.query.search,
            page: req.query.page,
            limit: req.query.limit,
        });

        return sendSuccess(
            res,
            "Staff doctors fetched successfully",
            data
        );
    } catch (error) {
        next(error);
    }
};


const getDoctorById = async (req, res, next) => {
    try {
        const doctorId = req.params.id;

        if (
            !doctorId ||
            doctorId === "undefined" ||
            doctorId === "null"
        ) {
            const error = new Error("Invalid doctor ID");
            error.statusCode = 400;
            throw error;
        }

        const data = await staffService.getDoctorById(doctorId);

        return sendSuccess(
            res,
            "Staff doctor fetched successfully",
            data
        );
    } catch (error) {
        next(error);
    }
};


const createDoctor = async (req, res, next) => {
    try {
        const data = await staffService.createDoctor(req.body);

        return sendSuccess(
            res,
            "Doctor created successfully",
            data,
            201
        );
    } catch (error) {
        next(error);
    }
};


const updateDoctor = async (req, res, next) => {
    try {
        const doctorId = req.params.id;

        if (
            !doctorId ||
            doctorId === "undefined" ||
            doctorId === "null"
        ) {
            const error = new Error("Invalid doctor ID");
            error.statusCode = 400;
            throw error;
        }

        const data = await staffService.updateDoctor(
            doctorId,
            req.body
        );

        return sendSuccess(
            res,
            "Doctor updated successfully",
            data
        );
    } catch (error) {
        next(error);
    }
};


// ============================================================
// APPOINTMENTS
// ============================================================

const getAppointments = async (req, res, next) => {
    try {
        const data = await staffService.getAppointments({
            date: req.query.date,
            doctorId: req.query.doctorId,
            status: req.query.status,
            search: req.query.search,
            page: req.query.page,
            limit: req.query.limit,
        });

        return sendSuccess(
            res,
            "Staff appointments fetched successfully",
            data
        );
    } catch (error) {
        next(error);
    }
};


// ============================================================
// GET APPOINTMENT BY ID
// ============================================================

const getAppointmentById = async (req, res, next) => {
    try {
        const appointmentId = req.params.id;

        console.log("=================================");
        console.log("GET APPOINTMENT CONTROLLER");
        console.log("Original URL:", req.originalUrl);
        console.log("Route params:", req.params);
        console.log("Appointment ID:", appointmentId);
        console.log("=================================");

        if (
            !appointmentId ||
            appointmentId === "undefined" ||
            appointmentId === "null"
        ) {
            const error = new Error("Invalid appointment ID");
            error.statusCode = 400;
            throw error;
        }

        const data = await staffService.getAppointmentById(
            appointmentId
        );

        return sendSuccess(
            res,
            "Staff appointment fetched successfully",
            data
        );
    } catch (error) {
        console.error(
            "getAppointmentById controller error:",
            error
        );

        next(error);
    }
};


// ============================================================
// CREATE APPOINTMENT
// ============================================================

const createAppointment = async (req, res, next) => {
    try {
        const data = await staffService.createAppointment(
            req.body
        );

        return sendSuccess(
            res,
            "Appointment created successfully",
            data,
            201
        );
    } catch (error) {
        next(error);
    }
};


// ============================================================
// UPDATE APPOINTMENT
// ============================================================

const updateAppointment = async (req, res, next) => {
    try {
        const appointmentId = req.params.id;

        console.log(
            "Updating appointment ID:",
            appointmentId
        );

        if (
            !appointmentId ||
            appointmentId === "undefined" ||
            appointmentId === "null"
        ) {
            const error = new Error("Invalid appointment ID");
            error.statusCode = 400;
            throw error;
        }

        const data = await staffService.updateAppointment(
            appointmentId,
            req.body
        );

        return sendSuccess(
            res,
            "Appointment updated successfully",
            data
        );
    } catch (error) {
        next(error);
    }
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    // Dashboard
    getDashboard,

    // Patients
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,

    // Doctors
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,

    // Appointments
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
};