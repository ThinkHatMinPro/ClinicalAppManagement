const prisma = require("../config/prisma");

const getDoctorByUserId = async (userId) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      userId,
    },
  });

  if (!doctor) {
    const error = new Error("Doctor profile not found");
    error.statusCode = 404;
    throw error;
  }

  return doctor;
};

const getDashboard = async (userId) => {
  const doctor = await getDoctorByUserId(userId);

  const [
    scheduled,
    inProgress,
    completed,
    cancelled,
    nextAppointment,
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
      },
    }),

    prisma.appointment.count({
      where: {
        doctorId: doctor.id,
        status: "IN_PROGRESS",
      },
    }),

    prisma.appointment.count({
      where: {
        doctorId: doctor.id,
        status: "COMPLETED",
      },
    }),

    prisma.appointment.count({
      where: {
        doctorId: doctor.id,
        status: "CANCELLED",
      },
    }),

    prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        startTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        patient: true,
      },
    }),
  ]);

  return {
    doctor,
    statistics: {
      scheduled,
      inProgress,
      completed,
      cancelled,
    },
    nextAppointment,
  };
};

const getProfile = async (userId) => {
  return getDoctorByUserId(userId);
};

const updateProfile = async (userId, data) => {
  const doctor = await getDoctorByUserId(userId);

  const {
    name,
    specialty,
    phone,
    email,
  } = data;

  return prisma.doctor.update({
    where: {
      id: doctor.id,
    },
    data: {
      ...(name !== undefined && {
        name: name.trim(),
      }),

      ...(specialty !== undefined && {
        specialty: specialty.trim(),
      }),

      ...(phone !== undefined && {
        phone: phone?.trim() || null,
      }),

      ...(email !== undefined && {
        email: email?.trim() || null,
      }),
    },
  });
};

const getAppointments = async (userId) => {
  const doctor = await getDoctorByUserId(userId);

  return prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
    },
    orderBy: {
      startTime: "asc",
    },
    include: {
      patient: true,
    },
  });
};

const getAppointmentById = async (
  userId,
  appointmentId
) => {
  const doctor = await getDoctorByUserId(userId);

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      doctorId: doctor.id,
    },
    include: {
      patient: true,
      doctor: true,
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
  const doctor = await getDoctorByUserId(userId);

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
    include: {
      patient: true,
      doctor: true,
    },
  });
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
};