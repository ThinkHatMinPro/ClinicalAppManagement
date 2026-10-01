require("dotenv").config();

const {
  PrismaClient,
  UserRole,
  AppointmentStatus,
} = require("@prisma/client");

const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// SEED

async function main() {
  console.log("🌱 Starting database seed...");

  const password = "Password@123";
  const passwordHash = await bcrypt.hash(password, 10);

  // CLEAR OLD DATA

  console.log("Clearing old data...");

  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();
  
  // STAFF LOGIN  

  console.log("Creating staff user...");

  await prisma.user.create({
    data: {
      email: "staff@test.com",
      passwordHash,
      role: UserRole.STAFF,
      isActive: true,
    },
  });
  
  // PATIENT USERS + PATIENT RECORDS  

  console.log("Creating patients...");

  // ----------------------
  // Shravya
  // ----------------------

  const shravyaUser = await prisma.user.create({
    data: {
      email: "shravya@example.com",
      passwordHash,
      role: UserRole.PATIENT,
      isActive: true,
    },
  });

  const shravya = await prisma.patient.create({
    data: {
      userId: shravyaUser.id,
      name: "Shravya",
      dateOfBirth: new Date("1998-04-15"),
      gender: "Female",
      phone: "9876543210",
      email: "shravya@example.com",
      address: "Hyderabad, Telangana",
    },
  });

  // ----------------------
  // Kusuma
  // ----------------------

  const kusumaUser = await prisma.user.create({
    data: {
      email: "kusuma@example.com",
      passwordHash,
      role: UserRole.PATIENT,
      isActive: true,
    },
  });

  const kusuma = await prisma.patient.create({
    data: {
      userId: kusumaUser.id,
      name: "Kusuma",
      dateOfBirth: new Date("2000-08-20"),
      gender: "Female",
      phone: "9876543211",
      email: "kusuma@example.com",
      address: "Khammam, Telangana",
    },
  });

  // ----------------------
  // John Doe
  // ----------------------

  const johnUser = await prisma.user.create({
    data: {
      email: "john@example.com",
      passwordHash,
      role: UserRole.PATIENT,
      isActive: true,
    },
  });

  const john = await prisma.patient.create({
    data: {
      userId: johnUser.id,
      name: "John Doe",
      dateOfBirth: new Date("1995-02-10"),
      gender: "Male",
      phone: "9876543212",
      email: "john@example.com",
      address: "Hyderabad, Telangana",
    },
  });

  // ----------------------
  // Rajesh
  // ----------------------

  const rajeshUser = await prisma.user.create({
    data: {
      email: "rajesh@example.com",
      passwordHash,
      role: UserRole.PATIENT,
      isActive: true,
    },
  });

  const rajesh = await prisma.patient.create({
    data: {
      userId: rajeshUser.id,
      name: "Rajesh",
      dateOfBirth: new Date("1990-11-05"),
      gender: "Male",
      phone: "9876543213",
      email: "rajesh@example.com",
      address: "Warangal, Telangana",
    },
  });

  // ----------------------
  // Maria
  // ----------------------

  const mariaUser = await prisma.user.create({
    data: {
      email: "maria@example.com",
      passwordHash,
      role: UserRole.PATIENT,
      isActive: true,
    },
  });

  const maria = await prisma.patient.create({
    data: {
      userId: mariaUser.id,
      name: "Maria",
      dateOfBirth: new Date("1997-06-25"),
      gender: "Female",
      phone: "9876543214",
      email: "maria@example.com",
      address: "Hyderabad, Telangana",
    },
  });
  
  // DOCTORS  

  console.log("Creating doctors...");

  // ----------------------
  // Dr. Anil Kumar
  // ----------------------

  const anilUser = await prisma.user.create({
    data: {
      email: "anil@clinic.com",
      passwordHash,
      role: UserRole.DOCTOR,
      isActive: true,
    },
  });

  const anil = await prisma.doctor.create({
    data: {
      userId: anilUser.id,
      name: "Dr. Anil Kumar",
      specialty: "General Physician",
      phone: "9876543301",
      email: "anil@clinic.com",
    },
  });

  // ----------------------
  // Dr. Priya Sharma
  // ----------------------

  const priyaUser = await prisma.user.create({
    data: {
      email: "priya@clinic.com",
      passwordHash,
      role: UserRole.DOCTOR,
      isActive: true,
    },
  });

  const priya = await prisma.doctor.create({
    data: {
      userId: priyaUser.id,
      name: "Dr. Priya Sharma",
      specialty: "Dermatologist",
      phone: "9876543302",
      email: "priya@clinic.com",
    },
  });

  // ----------------------
  // Dr. Michael Brown
  // ----------------------

  const michaelUser = await prisma.user.create({
    data: {
      email: "michael@clinic.com",
      passwordHash,
      role: UserRole.DOCTOR,
      isActive: true,
    },
  });

  const michael = await prisma.doctor.create({
    data: {
      userId: michaelUser.id,
      name: "Dr. Michael Brown",
      specialty: "Cardiologist",
      phone: "9876543303",
      email: "michael@clinic.com",
    },
  });

  // ----------------------
  // Dr. Sarah Smith
  // ----------------------

  const sarahUser = await prisma.user.create({
    data: {
      email: "sarah@clinic.com",
      passwordHash,
      role: UserRole.DOCTOR,
      isActive: true,
    },
  });

  const sarah = await prisma.doctor.create({
    data: {
      userId: sarahUser.id,
      name: "Dr. Sarah Smith",
      specialty: "Orthopedics",
      phone: "9876543304",
      email: "sarah@clinic.com",
    },
  });

  // ----------------------
  // Dr. Lisa Chen
  // ----------------------

  const lisaUser = await prisma.user.create({
    data: {
      email: "lisa@clinic.com",
      passwordHash,
      role: UserRole.DOCTOR,
      isActive: true,
    },
  });

  await prisma.doctor.create({
    data: {
      userId: lisaUser.id,
      name: "Dr. Lisa Chen",
      specialty: "Neurologist",
      phone: "9876543305",
      email: "lisa@clinic.com",
    },
  });
  
  // APPOINTMENTS  

  console.log("Creating appointments...");

  await prisma.appointment.createMany({
    data: [
      // A001 - John Doe / Dr. Anil Kumar
      {
        patientId: john.id,
        doctorId: anil.id,

        startTime: new Date("2026-09-30T09:00:00"),
        endTime: new Date("2026-09-30T09:30:00"),

        status: AppointmentStatus.SCHEDULED,

        reason: "General consultation",
        notes: "Regular health checkup",
      },

      // A002 - Shravya / Dr. Anil Kumar
      {
        patientId: shravya.id,
        doctorId: anil.id,

        startTime: new Date("2026-09-30T10:30:00"),
        endTime: new Date("2026-09-30T11:00:00"),

        status: AppointmentStatus.SCHEDULED,

        reason: "Fever and cold",
        notes: "Patient reported fever and weakness",
      },

      // A003 - Kusuma / Dr. Priya Sharma
      {
        patientId: kusuma.id,
        doctorId: priya.id,

        startTime: new Date("2026-09-30T12:00:00"),
        endTime: new Date("2026-09-30T12:30:00"),

        status: AppointmentStatus.IN_PROGRESS,

        reason: "Skin consultation",
        notes: "Dermatology consultation",
      },

      // A004 - Rajesh / Dr. Michael Brown
      {
        patientId: rajesh.id,
        doctorId: michael.id,

        startTime: new Date("2026-09-30T14:30:00"),
        endTime: new Date("2026-09-30T15:00:00"),

        status: AppointmentStatus.SCHEDULED,

        reason: "Chest discomfort",
        notes: "Cardiology consultation",
      },

      // A005 - Maria / Dr. Sarah Smith
      {
        patientId: maria.id,
        doctorId: sarah.id,

        startTime: new Date("2026-09-30T16:00:00"),
        endTime: new Date("2026-09-30T16:30:00"),

        status: AppointmentStatus.CANCELLED,

        reason: "Knee pain",
        notes: "Appointment cancelled by patient",
      },
    ],
  });
  
  // SUCCESS  

  console.log("");
  console.log("========================================");
  console.log("✅ Database seeded successfully");
  console.log("========================================");

  console.log("");
  console.log("LOGIN CREDENTIALS");
  console.log("----------------------------------------");

  console.log("STAFF");
  console.log("Email: staff@test.com");
  console.log("Password: Password@123");

  console.log("");

  console.log("PATIENT");
  console.log("Email: kusuma@example.com");
  console.log("Password: Password@123");

  console.log("");

  console.log("DOCTOR");
  console.log("Email: anil@clinic.com");
  console.log("Password: Password@123");

  console.log("----------------------------------------");
}

// ======================================================
// RUN SEED
// ======================================================

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });