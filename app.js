const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Blogs = require("./models/blogModel");
const userRouter = require("./routers/userRouter");
const blogRouter = require("./routers/blogRouter");
const blogController = require("./controllers/blogController");
const { authCheck } = require("./utils/authCheck");
const globalErrorHandler = require("./controllers/errorController");
const morgan = require("morgan");
app.set("view engine", "ejs");
app.use(morgan("dev"));

app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "dummy key",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(authCheck);
// app.get("/home", (req, res) => {
//   res.render("home");
// });
app.get("/", blogController.home);
app.get("/home", blogController.home);
app.use("/blogs", blogRouter);
app.use(userRouter);

app.use(globalErrorHandler.errorHandler);
module.exports = app;
