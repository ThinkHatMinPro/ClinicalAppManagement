const prisma = require("../config/prisma");

const getDoctor = async (userId) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      specialty: true,
      phone: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!doctor) {
    const error = new Error("Doctor profile not found");
    error.statusCode = 404;
    throw error;
  }

  return doctor;
};

const getAppointments = async (userId) => {
  const doctor = await prisma.doctor.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!doctor) {
    const error = new Error("Doctor profile not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
    },
    orderBy: {
      startTime: "asc",
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      reason: true,
      notes: true,
      patient: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          dateOfBirth: true,
          gender: true,
        },
      },
    },
  });
};

const getAppointmentById = async (userId, appointmentId) => {
  const doctor = await prisma.doctor.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!doctor) {
    const error = new Error("Doctor profile not found");
    error.statusCode = 404;
    throw error;
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      doctorId: doctor.id,
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      reason: true,
      notes: true,
      patient: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          dateOfBirth: true,
          gender: true,
          address: true,
        },
      },
    },
  });

  if (!appointment) {
    const error = new Error("Appointment not found");
    error.statusCode = 404;
    throw error;
  }

  return appointment;
};

const updateAppointmentStatus = async (
  userId,
  appointmentId,
  status
) => {
  const allowedStatuses = [
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid appointment status");
    error.statusCode = 400;
    throw error;
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!doctor) {
    const error = new Error("Doctor profile not found");
    error.statusCode = 404;
    throw error;
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      doctorId: doctor.id,
    },
  });

  if (!appointment) {
    const error = new Error("Appointment not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      reason: true,
      notes: true,
    },
  });
};

module.exports = {
  getDoctor,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
};