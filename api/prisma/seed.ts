import {
  PrismaClient,
  UserRole,
  AppointmentStatus,
} from "../src/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL="postgresql://postgres.rclfgcubuuaydarajwcs:KSPMiniProject_2026@aws-0-ap-south-1.pooler.supabase.com:5432/postgres",
});

const prisma = new PrismaClient({
  adapter,
});
async function main() {
  const password = "Password@123";
  const passwordHash = await bcrypt.hash(password, 10);

  // Clear existing test data
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();

  // -------------------------
  // Patient Login
  // -------------------------
  const patientUser = await prisma.user.create({
    data: {
      email: "patient@test.com",
      passwordHash,
      role: UserRole.PATIENT,
      isActive: true,
    },
  });

  const patient = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      name: "John Patient",
      dateOfBirth: new Date("1998-05-15"),
      gender: "Male",
      phone: "9876543210",
      email: "patient@test.com",
      address: "Hyderabad, Telangana",
    },
  });

  // -------------------------
  // Doctor Login
  // -------------------------
  const doctorUser = await prisma.user.create({
    data: {
      email: "doctor@test.com",
      passwordHash,
      role: UserRole.DOCTOR,
      isActive: true,
    },
  });

  const doctor = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      name: "Dr. Sarah Smith",
      specialty: "General Medicine",
      phone: "9876501234",
      email: "doctor@test.com",
    },
  });

  // -------------------------
  // Staff Login
  // -------------------------
  await prisma.user.create({
    data: {
      email: "staff@test.com",
      passwordHash,
      role: UserRole.STAFF,
      isActive: true,
    },
  });

  // -------------------------
  // Walk-in Patient
  // -------------------------
  const walkInPatient = await prisma.patient.create({
    data: {
      name: "Walk-in Patient",
      dateOfBirth: new Date("1995-10-20"),
      gender: "Female",
      phone: "9123456780",
      email: "walkin@example.com",
      address: "Warangal, Telangana",
    },
  });

  // -------------------------
  // Appointments
  // -------------------------
  await prisma.appointment.createMany({
    data: [
      {
        patientId: patient.id,
        doctorId: doctor.id,
        startTime: new Date("2026-10-05T10:00:00"),
        endTime: new Date("2026-10-05T10:30:00"),
        status: AppointmentStatus.SCHEDULED,
        reason: "Regular health checkup",
        notes: "First appointment",
      },
      {
        patientId: walkInPatient.id,
        doctorId: doctor.id,
        startTime: new Date("2026-10-05T11:00:00"),
        endTime: new Date("2026-10-05T11:30:00"),
        status: AppointmentStatus.SCHEDULED,
        reason: "Fever and cold",
        notes: "Walk-in appointment",
      },
    ],
  });

  console.log("Seed completed successfully.");
  console.log("");
  console.log("Test login credentials:");
  console.log("Patient: patient@test.com / Password@123");
  console.log("Doctor:  doctor@test.com / Password@123");
  console.log("Staff:   staff@test.com / Password@123");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });