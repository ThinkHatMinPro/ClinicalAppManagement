// src/guards/activeUserGuard.js

const userRepository = require("../repositories/userRepository");

const activeUserGuard = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    req.currentUser = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = activeUserGuard;