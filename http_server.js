// Ivan Fernandez Gracia

const express = require("express");
const app = express();
const low = require("lowdb");
const fs = require("lowdb/adapters/FileSync");
const adapter = new fs("db.json");
const db = low(adapter);
const cors = require("cors");

var port = process.env.PORT || 3001;
console.log(port);
// allow cross-origin resource sharing (CORS)
var allowlist = [
  "https://users-mit.herokuapp.com/",
  `http://localhost:${port}/`,
];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));

// data parser - used to parse post data
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve static files from public directory
// -------------------------------------------
app.use(express.static("public"));

// init the data store
db.defaults({ users: [] }).write();

// return all users
app.get("/data", function (req, res) {
  res.send(db.get("users").value());
});

// delete all users
app.get("/deleteusers", function (req, res) {
  console.log("delete User log server");
  db.get("users").remove({}).write();
  res.send(db.get("users").value());
});

// add user
app.post("/add", function (req, res) {
  console.log("add  User log server");
  var user = {
    name: req.body.name,
    dob: req.body.dob,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    phone: req.body.phone,
    streetaddress: req.body.streetaddress,
    citystatezip: req.body.citystatezip,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    avatar: req.body.avatar,
  };
  db.get("users").push(user).write();
  // console.log(db.get("users").value());
  res.send(db.get("users").value());
});

// start server
// -----------------------
app.listen(port, function () {
  console.log(`Running on port ${port}!`);
});
