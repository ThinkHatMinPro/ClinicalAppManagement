const pool = require("../config/db");
const prisma = require("../config/prisma");

const findByEmail = async (email) => {
  const result = await pool.query(
    `SELECT
       id,
       email,
       "passwordHash" AS password,
       role,
       "isActive" AS active,
       "createdAt" AS created_at
     FROM "User"
     WHERE LOWER(email) = LOWER($1)`,
    [email],
  );

  return result.rows[0];
};

// Creates the login and its Patient/Doctor profile together.
// If either insert fails, neither is saved.
const createUserWithProfile = async ({
  email,
  passwordHash,
  role,
  profile,
}) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, passwordHash, role },
      select: { id: true, email: true, role: true },
    });

    if (role === "PATIENT") {
      await tx.patient.create({
        data: {
          userId: user.id,
          name: profile.name,
          dateOfBirth: profile.dateOfBirth,
          gender: profile.gender,
          phone: profile.phone,
          email,
          address: profile.address,
        },
      });
    }

    if (role === "DOCTOR") {
      await tx.doctor.create({
        data: {
          userId: user.id,
          name: profile.name,
          specialty: profile.specialty,
          phone: profile.phone,
          email,
        },
      });
    }

    return user;
  });
};

module.exports = {
  findByEmail,
  createUserWithProfile,
};
