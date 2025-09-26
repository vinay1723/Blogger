const User = require("../models/userModel");

exports.allUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      throw new Error("users not found");
    }
    res.status(201).json({
      status: "success",
      users: users,
      newToken: req.token,
    });
  } catch (err) {
    next({ message: err.message });
  }
};
