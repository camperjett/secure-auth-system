module.exports = {
  HOST: "localhost", // when local
  // HOST: "postgres", // when dockerized
  USER: "user",
  PASSWORD: "pass",
  DB: "db",
  dialect: "postgres",
  // PORT: "5432", // when dockerized
  PORT: "35432", // when local
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};


// database: 'db',
// password: 'pass',
// // port: 5432, // when dockerized
// port: 35432 // when locally run