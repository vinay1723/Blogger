const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const blogController = require("../controllers/blogController");
const app = require("../app");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/signup", (req, res, next) => {
  res.render("signup", { message: null });
});

router.get("/login", (req, res) => {
  res.render("login");
});

// router.use(authController.protect);

// router.get("/", (req, res) => {
//   res.render("home");
// });

router.use(authController.protect);

router.get("/allusers", userController.allUsers);
router.get("/logout", authController.logout);

module.exports = router;
