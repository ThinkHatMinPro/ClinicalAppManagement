const prisma = require("../config/prisma");

//Get Patient record belonging to logged-in user.
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

//Patient Dashboard
const getDashboard = async (userId) => {
  const patient = await getPatientByUserId(userId);
  const now = new Date();
  const [
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    nextAppointment,
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        patientId: patient.id,
        startTime: {
          gte: now,
        },
        status: "SCHEDULED",
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
        startTime: {
          gte: now,
        },
        status: "SCHEDULED",
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
          },
        },
      },
    }),
  ]);

  return {
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    nextAppointment,
  };
};

//Get logged-in patient's profile.
const getProfile = async (userId) => {
  return getPatientByUserId(userId);
};

//Update patient profile.
const updateProfile = async (userId, data) => {
  const patient = await getPatientByUserId(userId);

  const allowedFields = [
    "name",
    "dateOfBirth",
    "gender",
    "phone",
    "email",
    "address",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  if (updateData.dateOfBirth) {
    updateData.dateOfBirth = new Date(updateData.dateOfBirth);
  }

  return prisma.patient.update({
    where: {
      id: patient.id,
    },
    data: updateData,
  });
};

// Get all active doctors.
const getDoctors = async () => {
  return prisma.doctor.findMany({
    where: {
      OR: [
        {
          userId: null,
        },
        {
          user: {
            isActive: true,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      specialty: true,
      phone: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

/**
 * Get doctor availability.
 *
 * With the current schema there is no DoctorAvailability/WorkingHours
 * table, so this returns already-booked appointments for the selected date.
 * The frontend can use these to disable occupied times.
 */
const getDoctorAvailableSlots = async (doctorId, date) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  if (!date) {
    const error = new Error("Date is required");
    error.statusCode = 400;
    throw error;
  }

  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = new Date(`${date}T23:59:59.999`);

  if (Number.isNaN(startOfDay.getTime()) || Number.isNaN(endOfDay.getTime())) {
    const error = new Error("Invalid date");
    error.statusCode = 400;
    throw error;
  }

  const bookedAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      status: {
        not: "CANCELLED",
      },
      startTime: {
        lte: endOfDay,
      },
      endTime: {
        gte: startOfDay,
      },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return {
    doctor,
    date,
    bookedAppointments,
  };
};

/**
 * Book appointment.
 */
const bookAppointment = async (
  userId,
  { doctorId, startTime, endTime, reason },
) => {
  const patient = await getPatientByUserId(userId);

  if (!doctorId || !startTime || !endTime) {
    const error = new Error("doctorId, startTime and endTime are required");
    error.statusCode = 400;
    throw error;
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    const error = new Error("Invalid appointment date/time");
    error.statusCode = 400;
    throw error;
  }

  if (start >= end) {
    const error = new Error("Appointment end time must be after start time");
    error.statusCode = 400;
    throw error;
  }

  if (start <= new Date()) {
    const error = new Error("Appointment must be scheduled for a future time");
    error.statusCode = 400;
    throw error;
  }

  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
    include: {
      user: {
        select: {
          isActive: true,
        },
      },
    },
  });

  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  if (doctor.user && !doctor.user.isActive) {
    const error = new Error("Doctor is currently inactive");
    error.statusCode = 400;
    throw error;
  }

  // Check doctor overlap.
  const doctorConflict = await prisma.appointment.findFirst({
    where: {
      doctorId,
      status: {
        not: "CANCELLED",
      },

      // Existing start < requested end
      // AND existing end > requested start
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
      "Doctor already has an appointment during this time",
    );
    error.statusCode = 409;
    throw error;
  }

  // Also prevent patient from booking overlapping appointments.
  const patientConflict = await prisma.appointment.findFirst({
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
    const error = new Error("You already have an appointment during this time");
    error.statusCode = 409;
    throw error;
  }

  return prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId,
      startTime: start,
      endTime: end,
      reason: reason || null,
      status: "SCHEDULED",
    },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          specialty: true,
        },
      },
    },
  });
};

/**
 * Get logged-in patient's appointments.
 */
const getAppointments = async (userId) => {
  const patient = await getPatientByUserId(userId);

  return prisma.appointment.findMany({
    where: {
      patientId: patient.id,
    },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          specialty: true,
          phone: true,
          email: true,
        },
      },
    },
    orderBy: {
      startTime: "desc",
    },
  });
};

/**
 * Get one appointment.
 */
const getAppointmentById = async (userId, appointmentId) => {
  const patient = await getPatientByUserId(userId);

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      patientId: patient.id,
    },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          specialty: true,
          phone: true,
          email: true,
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

/**
 * Cancel appointment.
 */
const cancelAppointment = async (userId, appointmentId) => {
  const appointment = await getAppointmentById(userId, appointmentId);

  if (appointment.status === "CANCELLED") {
    const error = new Error("Appointment is already cancelled");
    error.statusCode = 400;
    throw error;
  }

  if (appointment.status === "COMPLETED") {
    const error = new Error("Completed appointment cannot be cancelled");
    error.statusCode = 400;
    throw error;
  }

  if (appointment.status === "IN_PROGRESS") {
    const error = new Error("Appointment in progress cannot be cancelled");
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
      doctor: {
        select: {
          id: true,
          name: true,
          specialty: true,
        },
      },
    },
  });
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
