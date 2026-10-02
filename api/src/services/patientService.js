const prisma = require("../config/prisma");

const getPatientByUserId = async (userId) => {
  const patient = await prisma.patient.findUnique({
    where: {
      userId,
    },
  });

  if (!patient) {
    const error = new Error("Patient profile not found");
    error.statusCode = 404;
    throw error;
  }

  return patient;
};

const getDashboard = async (userId) => {
  const patient = await getPatientByUserId(userId);

  const [upcoming, completed, cancelled, nextAppointment] =
    await Promise.all([
      prisma.appointment.count({
        where: {
          patientId: patient.id,
          status: "SCHEDULED",
          startTime: {
            gte: new Date(),
          },
        },
      }),

      prisma.appointment.count({
        where: {
          patientId: patient.id,
          status: "COMPLETED",
        },
      }),

      prisma.appointment.count({
        where: {
          patientId: patient.id,
          status: "CANCELLED",
        },
      }),

      prisma.appointment.findFirst({
        where: {
          patientId: patient.id,
          status: "SCHEDULED",
          startTime: {
            gte: new Date(),
          },
        },
        orderBy: {
          startTime: "asc",
        },
        include: {
          doctor: true,
        },
      }),
    ]);

  return {
    patient,
    statistics: {
      upcoming,
      completed,
      cancelled,
    },
    nextAppointment,
  };
};

const getProfile = async (userId) => {
  return getPatientByUserId(userId);
};

const updateProfile = async (userId, data) => {
  const patient = await getPatientByUserId(userId);

  const {
    name,
    dateOfBirth,
    gender,
    phone,
    email,
    address,
  } = data;

  return prisma.patient.update({
    where: {
      id: patient.id,
    },
    data: {
      ...(name !== undefined && {
        name: name.trim(),
      }),

      ...(dateOfBirth !== undefined && {
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth)
          : null,
      }),

      ...(gender !== undefined && {
        gender: gender?.trim() || null,
      }),

      ...(phone !== undefined && {
        phone: phone?.trim() || null,
      }),

      ...(email !== undefined && {
        email: email?.trim() || null,
      }),

      ...(address !== undefined && {
        address: address?.trim() || null,
      }),
    },
  });
};

const getDoctors = async () => {
  return prisma.doctor.findMany({
    
    orderBy: {
      name: "asc",
    },
  });
};

const getAvailableSlots = async (userId, doctorId, date) => {
  if (!date) {
    const error = new Error("Date is required");
    error.statusCode = 400;
    throw error;
  }

  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

if (!doctor || !doctor.isActive) {
    const error = new Error("Doctor not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59.999`);

  if (Number.isNaN(dayStart.getTime())) {
    const error = new Error("Invalid date");
    error.statusCode = 400;
    throw error;
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      status: {
        not: "CANCELLED",
      },
      startTime: {
        lt: dayEnd,
      },
      endTime: {
        gt: dayStart,
      },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  const slots = [];

  const workingStartHour = 9;
  const workingEndHour = 17;
  const slotDurationMinutes = 30;

  for (
    let minutes = workingStartHour * 60;
    minutes < workingEndHour * 60;
    minutes += slotDurationMinutes
  ) {
    const startHour = Math.floor(minutes / 60);
    const startMinute = minutes % 60;

    const endMinutes = minutes + slotDurationMinutes;
    const endHour = Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;

    const startTime = new Date(dayStart);

    startTime.setHours(
      startHour,
      startMinute,
      0,
      0,
    );

    const endTime = new Date(dayStart);

    endTime.setHours(
      endHour,
      endMinute,
      0,
      0,
    );

    const isBooked = appointments.some(
      (appointment) => {
        return (
          startTime <
            new Date(appointment.endTime) &&
          endTime >
            new Date(appointment.startTime)
        );
      },
    );

    if (!isBooked) {
      slots.push({
        startTime: `${String(startHour).padStart(
          2,
          "0",
        )}:${String(startMinute).padStart(2, "0")}`,

        endTime: `${String(endHour).padStart(
          2,
          "0",
        )}:${String(endMinute).padStart(2, "0")}`,
      });
    }
  }

  return slots;
};

const createAppointment = async (
  userId,
  data,
) => {
  const patient = await getPatientByUserId(userId);

  const {
    doctorId,
    startTime,
    endTime,
    reason,
  } = data;

  if (!doctorId || !startTime || !endTime) {
    const error = new Error(
      "Doctor, start time and end time are required",
    );
    error.statusCode = 400;
    throw error;
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    const error = new Error("Invalid appointment time");
    error.statusCode = 400;
    throw error;
  }

  if (start >= end) {
    const error = new Error(
      "End time must be after start time",
    );
    error.statusCode = 400;
    throw error;
  }

  if (start <= new Date()) {
    const error = new Error(
      "Appointment must be in the future",
    );
    error.statusCode = 400;
    throw error;
  }

  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!doctor || !doctor.isActive) {
    const error = new Error(
      "Doctor not found or inactive",
    );
    error.statusCode = 404;
    throw error;
  }

  const doctorConflict =
    await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: {
          not: "CANCELLED",
        },
        startTime: {
          lt: end,
        },
        endTime: {
          gt: start,
        },
      },
    });

  if (doctorConflict) {
    const error = new Error(
      "Doctor is already booked for this time",
    );
    error.statusCode = 409;
    throw error;
  }

  const patientConflict =
    await prisma.appointment.findFirst({
      where: {
        patientId: patient.id,
        status: {
          not: "CANCELLED",
        },
        startTime: {
          lt: end,
        },
        endTime: {
          gt: start,
        },
      },
    });

  if (patientConflict) {
    const error = new Error(
      "You already have an appointment during this time",
    );
    error.statusCode = 409;
    throw error;
  }

  return prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId,
      startTime: start,
      endTime: end,
      reason: reason?.trim() || null,
      status: "SCHEDULED",
    },
    include: {
      doctor: true,
      patient: true,
    },
  });
};

const getAppointments = async (userId) => {
  const patient = await getPatientByUserId(userId);

  return prisma.appointment.findMany({
    where: {
      patientId: patient.id,
    },
    orderBy: {
      startTime: "asc",
    },
    include: {
      doctor: true,
    },
  });
};

const getAppointmentById = async (
  userId,
  appointmentId,
) => {
  const patient = await getPatientByUserId(userId);

  const appointment =
    await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: patient.id,
      },
      include: {
        doctor: true,
        patient: true,
      },
    });

  if (!appointment) {
    const error = new Error(
      "Appointment not found",
    );
    error.statusCode = 404;
    throw error;
  }

  return appointment;
};

const cancelAppointment = async (
  userId,
  appointmentId,
) => {
  const patient = await getPatientByUserId(userId);

  const appointment =
    await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: patient.id,
      },
    });

  if (!appointment) {
    const error = new Error(
      "Appointment not found",
    );
    error.statusCode = 404;
    throw error;
  }

  if (appointment.status === "CANCELLED") {
    const error = new Error(
      "Appointment is already cancelled",
    );
    error.statusCode = 400;
    throw error;
  }

  if (appointment.status === "COMPLETED") {
    const error = new Error(
      "Completed appointment cannot be cancelled",
    );
    error.statusCode = 400;
    throw error;
  }

  return prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status: "CANCELLED",
    },
    include: {
      doctor: true,
      patient: true,
    },
  });
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getDoctors,
  getAvailableSlots,
  createAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment,
};