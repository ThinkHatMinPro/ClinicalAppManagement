const authService = require("../services/authService");

const signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};