const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const ALLOWED_ROLES = ["PATIENT", "DOCTOR", "STAFF"];

const signup = async ({ name, email, password, role }) => {
  if (!name || !email || !password || !role) {
    const error = new Error(
      "Name, email, password and role are required"
    );
    error.statusCode = 400;
    throw error;
  }

  const normalizedRole = role.trim().toUpperCase();

  if (!ALLOWED_ROLES.includes(normalizedRole)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error(
      "Password must contain at least 8 characters"
    );
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await userRepository.findByEmail(email.trim());

  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  return userRepository.createUser({
    email: email.trim(),
    password: hashedPassword,
    role: normalizedRole,
  });
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findByEmail(email.trim());

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.active) {
    const error = new Error("Account is inactive");
    error.statusCode = 403;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

module.exports = {
  signup,
  login,
};