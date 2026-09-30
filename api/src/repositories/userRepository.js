const pool = require("../config/db");
const { randomUUID } = require("crypto");

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
    [email]
  );

  return result.rows[0];
};

const createUser = async ({ email, password, role }) => {
  const id = randomUUID();

  const result = await pool.query(
    `INSERT INTO "User"
       (
         id,
         email,
         "passwordHash",
         role,
         "isActive",
         "createdAt",
         "updatedAt"
       )
     VALUES ($1, $2, $3, $4, TRUE, NOW(), NOW())
     RETURNING
       id,
       email,
       role,
       "isActive" AS active,
       "createdAt" AS created_at`,
    [
      id,
      email.toLowerCase(),
      password,
      role
    ]
  );

  return result.rows[0];
};

module.exports = {
  findByEmail,
  createUser,
};