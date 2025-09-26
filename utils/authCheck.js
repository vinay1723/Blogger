exports.authCheck = (req, res, next) => {
  res.locals.isAuthenticated = req.cookies.jwt ? true : false;
  next();
};
