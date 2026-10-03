const doctorService = require("../services/doctorService");

const sendSuccess = (res, message, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const getProfile = async (req, res, next) => {
  try {
    const data = await doctorService.getDoctor(req.user.id);

    return sendSuccess(
      res,
      "Doctor profile fetched successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const data = await doctorService.getAppointments(req.user.id);

    return sendSuccess(
      res,
      "Doctor appointments fetched successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const data = await doctorService.getAppointmentById(
      req.user.id,
      req.params.id
    );

    return sendSuccess(
      res,
      "Doctor appointment fetched successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const data = await doctorService.updateAppointmentStatus(
      req.user.id,
      req.params.id,
      req.body.status
    );

    return sendSuccess(
      res,
      "Appointment status updated successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
};