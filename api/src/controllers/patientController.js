const patientService = require("../services/patientService");

const sendSuccess = (res, message, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const getDashboard = async (req, res, next) => {
  try {
    const data = await patientService.getDashboard(req.user.id);

    return sendSuccess(res, "Patient dashboard fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const data = await patientService.getProfile(req.user.id);

    return sendSuccess(res, "Patient profile fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = await patientService.updateProfile(req.user.id, req.body);

    return sendSuccess(res, "Patient profile updated successfully", data);
  } catch (error) {
    next(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const data = await patientService.getDoctors();

    return sendSuccess(res, "Doctors fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const getDoctorAvailableSlots = async (req, res, next) => {
  try {
    const data = await patientService.getDoctorAvailableSlots(
      req.params.doctorId,
      req.query.date,
    );

    return sendSuccess(res, "Doctor availability fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const bookAppointment = async (req, res, next) => {
  try {
    const data = await patientService.bookAppointment(req.user.id, req.body);

    return sendSuccess(res, "Appointment booked successfully", data, 201);
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const data = await patientService.getAppointments(req.user.id);

    return sendSuccess(res, "Appointments fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const data = await patientService.getAppointmentById(
      req.user.id,
      req.params.id,
    );

    return sendSuccess(res, "Appointment fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const data = await patientService.cancelAppointment(
      req.user.id,
      req.params.id,
    );

    return sendSuccess(res, "Appointment cancelled successfully", data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getDoctors,
  getDoctorAvailableSlots,
  bookAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment,
};
