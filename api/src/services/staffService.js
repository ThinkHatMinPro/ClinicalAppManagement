const prisma = require("../config/prisma");

const getDashboard = async () => {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const endOfWeek = new Date(startOfToday);
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  endOfWeek.setHours(23, 59, 59, 999);

  const [
    totalPatients,
    totalDoctors,
    todayAppointments,
    upcomingAppointments,
    todayAppointmentList,
  ] = await Promise.all([
    prisma.patient.count(),

    prisma.doctor.count(),

    prisma.appointment.count({
      where: {
        startTime: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    }),

    prisma.appointment.count({
      where: {
        startTime: {
          gt: endOfToday,
          lte: endOfWeek,
        },
        status: {
          not: "CANCELLED",
        },
      },
    }),

    prisma.appointment.findMany({
      where: {
        startTime: {
          gte: startOfToday,
          lte: endOfToday,
        },
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
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
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
    totalPatients,
    totalDoctors,
    todayAppointments,
    upcomingAppointments,
    todayAppointmentList,
  };
};

const getPatients = async ({ search, page = 1, limit = 10 }) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;

  const normalizedSearch = search?.trim();

  const where = normalizedSearch
    ? {
        OR: [
          {
            name: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: parsedLimit,
      select: {
        id: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        phone: true,
        email: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.patient.count({
      where,
    }),
  ]);

  return {
    patients,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};
const getPatientById = async (patientId) => {
  const patient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
    select: {
      id: true,
      name: true,
      dateOfBirth: true,
      gender: true,
      phone: true,
      email: true,
      address: true,
      createdAt: true,
      updatedAt: true,
      appointments: {
        orderBy: {
          startTime: "desc",
        },
        take: 10,
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          reason: true,
          notes: true,
          doctor: {
            select: {
              id: true,
              name: true,
              specialty: true,
            },
          },
        },
      },
    },
  });

  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  return patient;
};
const createPatient = async ({
  name,
  dateOfBirth,
  gender,
  phone,
  email,
  address,
}) => {
  if (!name || !name.trim()) {
    const error = new Error("Patient name is required");
    error.statusCode = 400;
    throw error;
  }

  const patient = await prisma.patient.create({
    data: {
      name: name.trim(),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender: gender?.trim() || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      address: address?.trim() || null,
    },
    select: {
      id: true,
      name: true,
      dateOfBirth: true,
      gender: true,
      phone: true,
      email: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return patient;
};

const updatePatient = async (
  patientId,
  { name, dateOfBirth, gender, phone, email, address },
) => {
  const existingPatient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
  });

  if (!existingPatient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  if (name !== undefined && !name.trim()) {
    const error = new Error("Patient name cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  const patient = await prisma.patient.update({
    where: {
      id: patientId,
    },
    data: {
      ...(name !== undefined && {
        name: name.trim(),
      }),
      ...(dateOfBirth !== undefined && {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
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
    select: {
      id: true,
      name: true,
      dateOfBirth: true,
      gender: true,
      phone: true,
      email: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return patient;
};

const getDoctors = async ({ search, page = 1, limit = 10 }) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;

  const normalizedSearch = search?.trim();

  const where = normalizedSearch
    ? {
        OR: [
          {
            name: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            specialty: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const [doctors, total] = await Promise.all([
    prisma.doctor.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: parsedLimit,
      select: {
        id: true,
        name: true,
        specialty: true,
        phone: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.doctor.count({
      where,
    }),
  ]);

  return {
    doctors,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};

const getDoctorById = async (doctorId) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
    select: {
      id: true,
      name: true,
      specialty: true,
      phone: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      appointments: {
        orderBy: {
          startTime: "desc",
        },
        take: 10,
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
            },
          },
        },
      },
    },
  });

  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  return doctor;
};

const createDoctor = async ({ name, specialty, phone, email }) => {
  if (!name || !name.trim()) {
    const error = new Error("Doctor name is required");
    error.statusCode = 400;
    throw error;
  }

  const doctor = await prisma.doctor.create({
    data: {
      name: name.trim(),
      specialty: specialty?.trim() || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
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

  return doctor;
};

const updateDoctor = async (doctorId, { name, specialty, phone, email }) => {
  const existingDoctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!existingDoctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  if (name !== undefined && !name.trim()) {
    const error = new Error("Doctor name cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  const doctor = await prisma.doctor.update({
    where: {
      id: doctorId,
    },
    data: {
      ...(name !== undefined && {
        name: name.trim(),
      }),
      ...(specialty !== undefined && {
        specialty: specialty?.trim() || null,
      }),
      ...(phone !== undefined && {
        phone: phone?.trim() || null,
      }),
      ...(email !== undefined && {
        email: email?.trim() || null,
      }),
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

  return doctor;
};

const getAppointments = async ({
  date,
  doctorId,
  status,
  search,
  page = 1,
  limit = 10,
}) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;

  const where = {};

  if (doctorId) {
    where.doctorId = doctorId;
  }

  if (status) {
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

    where.status = status;
  }

  if (date) {
    const startOfDate = new Date(`${date}T00:00:00`);
    const endOfDate = new Date(`${date}T23:59:59.999`);

    if (
      Number.isNaN(startOfDate.getTime()) ||
      Number.isNaN(endOfDate.getTime())
    ) {
      const error = new Error("Invalid appointment date");
      error.statusCode = 400;
      throw error;
    }

    where.startTime = {
      gte: startOfDate,
      lte: endOfDate,
    };
  }

  const normalizedSearch = search?.trim();

  if (normalizedSearch) {
    where.OR = [
      {
        patient: {
          name: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
      },
      {
        doctor: {
          name: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      orderBy: {
        startTime: "asc",
      },
      skip,
      take: parsedLimit,
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        reason: true,
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
          },
        },
      },
    }),

    prisma.appointment.count({
      where,
    }),
  ]);

  return {
    appointments,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};

const createAppointment = async ({
  patientId,
  doctorId,
  startTime,
  endTime,
  reason,
  notes,
}) => {
  if (!patientId || !doctorId || !startTime || !endTime) {
    const error = new Error(
      "Patient, doctor, start time, and end time are required",
    );
    error.statusCode = 400;
    throw error;
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    const error = new Error("Invalid appointment date or time");
    error.statusCode = 400;
    throw error;
  }

  if (end <= start) {
    const error = new Error("Appointment end time must be after start time");
    error.statusCode = 400;
    throw error;
  }

  const [patient, doctor] = await Promise.all([
    prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true },
    }),
    prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { id: true },
    }),
  ]);

  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  const conflictingAppointment = await prisma.appointment.findFirst({
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
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  });

  if (conflictingAppointment) {
    const error = new Error(
      "Doctor already has an appointment during the selected time",
    );
    error.statusCode = 409;
    throw error;
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId,
      doctorId,
      startTime: start,
      endTime: end,
      reason: reason?.trim() || null,
      notes: notes?.trim() || null,
      status: "SCHEDULED",
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      reason: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      patient: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          specialty: true,
        },
      },
    },
  });

  return appointment;
};

const updateAppointment = async (
  appointmentId,
  { patientId, doctorId, startTime, endTime, status, reason, notes },
) => {
  const existingAppointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: {
      id: true,
      patientId: true,
      doctorId: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  });

  if (!existingAppointment) {
    const error = new Error("Appointment not found");
    error.statusCode = 404;
    throw error;
  }

  const allowedStatuses = [
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];

  if (status !== undefined && !allowedStatuses.includes(status)) {
    const error = new Error("Invalid appointment status");
    error.statusCode = 400;
    throw error;
  }

  const finalPatientId = patientId ?? existingAppointment.patientId;
  const finalDoctorId = doctorId ?? existingAppointment.doctorId;

  const finalStartTime = startTime
    ? new Date(startTime)
    : existingAppointment.startTime;

  const finalEndTime = endTime
    ? new Date(endTime)
    : existingAppointment.endTime;

  if (
    Number.isNaN(finalStartTime.getTime()) ||
    Number.isNaN(finalEndTime.getTime())
  ) {
    const error = new Error("Invalid appointment date or time");
    error.statusCode = 400;
    throw error;
  }

  if (finalEndTime <= finalStartTime) {
    const error = new Error("Appointment end time must be after start time");
    error.statusCode = 400;
    throw error;
  }

  const [patient, doctor] = await Promise.all([
    prisma.patient.findUnique({
      where: { id: finalPatientId },
      select: { id: true },
    }),
    prisma.doctor.findUnique({
      where: { id: finalDoctorId },
      select: { id: true },
    }),
  ]);

  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  const finalStatus = status ?? existingAppointment.status;

  if (finalStatus !== "CANCELLED") {
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        id: {
          not: appointmentId,
        },
        doctorId: finalDoctorId,
        status: {
          not: "CANCELLED",
        },
        startTime: {
          lt: finalEndTime,
        },
        endTime: {
          gt: finalStartTime,
        },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
      },
    });

    if (conflictingAppointment) {
      const error = new Error(
        "Doctor already has an appointment during the selected time",
      );
      error.statusCode = 409;
      throw error;
    }
  }

  const appointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      ...(patientId !== undefined && {
        patientId: finalPatientId,
      }),

      ...(doctorId !== undefined && {
        doctorId: finalDoctorId,
      }),

      ...(startTime !== undefined && {
        startTime: finalStartTime,
      }),

      ...(endTime !== undefined && {
        endTime: finalEndTime,
      }),

      ...(status !== undefined && {
        status,
      }),

      ...(reason !== undefined && {
        reason: reason?.trim() || null,
      }),

      ...(notes !== undefined && {
        notes: notes?.trim() || null,
      }),
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      reason: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      patient: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          specialty: true,
        },
      },
    },
  });

  return appointment;
};

const getAppointmentById = async (appointmentId) => {
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      reason: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      patient: {
        select: {
          id: true,
          name: true,
          dateOfBirth: true,
          gender: true,
          phone: true,
          email: true,
          address: true,
        },
      },
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

const deletePatient = async (patientId) => {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { id: true, userId: true },
  });

  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  const appointmentCount = await prisma.appointment.count({
    where: { patientId },
  });

  if (appointmentCount > 0) {
    const error = new Error(
      "Cannot delete a patient who has appointments. Delete or reassign their appointments first.",
    );
    error.statusCode = 409;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.patient.delete({ where: { id: patientId } });

    if (patient.userId) {
      await tx.user.delete({ where: { id: patient.userId } });
    }
  });

  return { id: patientId };
};

const deleteDoctor = async (doctorId) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: { id: true, userId: true },
  });

  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  const appointmentCount = await prisma.appointment.count({
    where: { doctorId },
  });

  if (appointmentCount > 0) {
    const error = new Error(
      "Cannot delete a doctor who has appointments. Delete or reassign their appointments first.",
    );
    error.statusCode = 409;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.doctor.delete({ where: { id: doctorId } });

    if (doctor.userId) {
      await tx.user.delete({ where: { id: doctor.userId } });
    }
  });

  return { id: doctorId };
};

const deleteAppointment = async (appointmentId) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: { id: true },
  });

  if (!appointment) {
    const error = new Error("Appointment not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.appointment.delete({ where: { id: appointmentId } });

  return { id: appointmentId };
};

module.exports = {
  getDashboard,
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentById,
};
