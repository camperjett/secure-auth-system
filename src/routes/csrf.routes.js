const controller = require("../controllers/user.controller");
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

  app.get('/setCSRFToken', csrfProtection, (req, res, next) => {
    const token = req.csrfToken();
    res.send({ csrfToken: token });
  });
  app.post('/checkCSRFToken', csrfProtection, function (req, res) {
    res.send({ msg: 'CSRF Token is valid.' })
  }); // If the token is invalid, it throws a 'ForbiddenError: invalid csrf token' error.
};