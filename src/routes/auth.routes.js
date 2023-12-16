const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const csrf = require('csurf');
const csrfProtection = csrf();

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.use(csrfProtection);
  // this is how we use middlewares !!
  app.post(
    "/api/auth/signup",
    [
      controller.validate('signup'),
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin",
    controller.validate('signin'),
    controller.signin);

  app.post("/api/auth/request-reset-password",
    controller.validate('requestResetPassword'),
    controller.requestResetPassword);
  app.post("/api/auth/reset-password",
    [
      controller.validate('resetPassword'),
      authJwt.verifyResetToken,
    ],
    controller.resetPassword
  );
};