require('dotenv').config()
const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");
const session = require('express-session');

const Role = db.role;
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

/*** CORS ***/
const sessionConfig = session({
  secret: process.env.CSRFT_SESSION_SECRET,
  keys: ['some random key'],
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: parseInt(process.env.CSRFT_EXPIRESIN), // Used for expiration time.
    sameSite: 'strict', // Cookies will only be sent in a first-party context. 'lax' is default value for third-parties.
    httpOnly: true, //Ensures the cookie is sent only over HTTP(S)
    domain: process.env.DOMAIN, //Used to compare against the domain of the server in which the URL is being requested.
    secure: false // Ensures the browser only sends the cookie over HTTPS. false for localhost.
  }
});
app.use(sessionConfig);


const PORT = 3000;
const HOST = '0.0.0.0';
global.__basedir = __dirname + "/..";

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/csrf.routes')(app);

function init() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
}

// db.sequelize.sync();
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  // this part of code initialize the db
  init();
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);