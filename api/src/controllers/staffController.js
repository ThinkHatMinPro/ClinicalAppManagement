const staffService = require("../services/staffService");

const sendSuccess = (res, message, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const getDashboard = async (req, res, next) => {
  try {
    const data = await staffService.getDashboard();

    return sendSuccess(
      res,
      "Staff dashboard fetched successfully",
      data,
    );
  } catch (error) {
    next(error);
  }
};

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
      data,
    );
  } catch (error) {
    next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const data = await staffService.getPatientById(req.params.id);

    return sendSuccess(
      res,
      "Staff patient fetched successfully",
      data,
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
      201,
    );
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const data = await staffService.updatePatient(
      req.params.id,
      req.body,
    );

    return sendSuccess(
      res,
      "Patient updated successfully",
      data,
    );
  } catch (error) {
    next(error);
  }
};

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
      data,
    );
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const data = await staffService.getDoctorById(req.params.id);

    return sendSuccess(
      res,
      "Staff doctor fetched successfully",
      data,
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
      201,
    );
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const data = await staffService.updateDoctor(
      req.params.id,
      req.body,
    );

    return sendSuccess(
      res,
      "Doctor updated successfully",
      data,
    );
  } catch (error) {
    next(error);
  }
};

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
      data,
    );
  } catch (error) {
    next(error);
  }
};

const createAppointment = async (req, res, next) => {
  try {
    const data = await staffService.createAppointment(req.body);

    return sendSuccess(
      res,
      "Appointment created successfully",
      data,
      201,
    );
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const data = await staffService.updateAppointment(
      req.params.id,
      req.body,
    );

    return sendSuccess(
      res,
      "Appointment updated successfully",
      data,
    );
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const data = await staffService.getAppointmentById(
      req.params.id,
    );

    return sendSuccess(
      res,
      "Staff appointment fetched successfully",
      data,
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  getAppointments,
  createAppointment,
  updateAppointment,
  getAppointmentById,
};