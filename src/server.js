const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");
const Role = db.role;
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

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