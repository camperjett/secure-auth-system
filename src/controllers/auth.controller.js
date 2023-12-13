const db = require("../models");
const config = require("../configs/auth.configs");
const User = db.user;
const Role = db.role;
const sendEmail = require("../utils/sendEmail");
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const PORT = 3000;
const HOST = '0.0.0.0';

exports.signup = async (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = async (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.requestResetPassword = async (req, res) => {
  // find user with email..
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(async user => {
    // create reset token..
    const token = jwt.sign({ id: user.id },
      config.emailSecret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });
    // send email (send reset link with it)
    const clientURL = `https://${HOST}:${PORT}`;
    const link = `${clientURL}/api/auth/reset-password?token=${token}&id=${user.username}`;
    await sendEmail(
      user.email,
      "Password Reset Request",
      {
        name: user.username,
        link: link
      },
      "./emails/templates/requestResetPassword.handlebars"
    )
    // return link of reset link (insecure, avoid, send "Sent reset password email!")
    res.status(200).send({ message: "Reset-Link successfully sent on email. Check your Inbox!" });
  })
    .catch(err => {
      res.status(404).send({ message: err.message });
    })
};

exports.resetPassword = async (req, res) => {
  await User.update({ password: bcrypt.hashSync(req.body.password, 8) },
    {
      where: {
        id: req.body.userId
      }
    }).then(async user => {
      await sendEmail(
        user.email,
        "Password Reset Successfully",
        {
          name: user.username,
        },
        "./template/resetPassword.handlebars"
      );
      res.status(201).send({ message: "Password updated!" });
    })
    .catch(err => {
      res.status(404).send({ message: err.message });
    });
};