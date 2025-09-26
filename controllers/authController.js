const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { promisify } = require("util");

function createSendToken(user, res, redirect) {
  // 1.creating web token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECREAT, {
    expiresIn: "90d",
  });
  //2.setting cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    // secure: true,
  };

  res.cookie("jwt", token, cookieOptions);
  // res.status(201).json({
  //   status: "success",
  //   token: token,
  //   newUser: user,
  // });
  res.redirect("/" + redirect);
}

exports.signup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    // 1. check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", {
        message: "User already exists, please login",
      });
    }

    // 2. check confirm password
    if (password !== confirmPassword) {
      return next({ message: "Passwords do not match" });
    }

    // 3. hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // 5. send token (JWT)
    // createSendToken(newUser, res, "user created successfully","login");
    // res.status(200).json({
    //   status: "success",
    //   message: "user successfully created",
    //   newUser: newUser,
    // });
    res.render("login", {
      message: "user successfully created please login 🎉🎉",
    });
  } catch (err) {
    console.log(err.message);
    next({ message: "failed to signup due to some server problem" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.render("login", {
        message: "User not registered with us. Please signup first",
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (passwordMatch) {
      console.log(res.locals);
      createSendToken(existingUser, res, "");
    } else {
      res.render("login", { message: "passwords does not match" });
    }
  } catch (err) {}
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    // From Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // If no token -> user is not authenticated
    if (!token) {
      // console.log("=============protect method finished----------");
      return next({ message: "Unauthorized user" });
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECREAT);
    const existingUser = await User.findById(decoded.id);
    if (!existingUser) {
      return next({ message: "user not found 💥💥💥" });
    }

    // User exists and token valid
    req.user = existingUser;
    req.token = token;
    next();
  } catch (err) {
    next({ message: "something went wrong 💥💥💥" });
  }
};

exports.logout = (req, res, next) => {
  console.log("logout was reached");
  res.cookie("jwt", "loggedout", { expires: new Date(Date.now() + 5 * 1000) });
  res.redirect("/login");
};
