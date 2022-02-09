const express = require("express");
const { connect } = require("mongoose");
//load the new env file
const { PORT, MONGODB_URL, GMAIL_USERNAME } = require("./config");
const { engine } = require("express-handlebars");
const passport = require("passport");

require("./middleware/passport")(passport);
//importing the built in middleware

const { join } = require("path");
const Handlebars = require("handlebars");
// to use put and delete which is not there in form
const methodOverride = require("method-override");
// use for toast msg
const flash = require("connect-flash");
const session = require("express-session");

//Importing all routing module
const EmployeeRoute = require("./Route/Employee");
const AuthRoute = require("./Route/auth");

// require("./middleware/passport")(passport);

//import all routing module

const app = express();

//! ===================database connection start here =====================//
let DatabaseConnection = async () => {
  await connect(MONGODB_URL);
  console.log("database connected");
};
DatabaseConnection();

//! ===================database connection end here =====================//

//? todo TEMPLATE ENGINE MIDDLEWARE STARTS HERE=========================//

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
// app.set("views", "/views");

//? todo TEMPLATE ENGINE MIDDLEWARE END HERE=========================//

//? BUILT IN MIDDLEWARE STARTS HERE=========================//

app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "node_modules")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//session middleware

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware
app.use(flash());

//HANDLEBARS HELPER CLASES
Handlebars.registerHelper("trimString", function (passedString) {
  var theString = passedString.slice(6);
  return new Handlebars.SafeString(theString);
});

//? ==================BUILT IN MIDDLEWARE STARTS HERE=========================//

//? ==================set global variables=========================//

app.use(function (req, res, next) {
  app.locals.SUCCESS_MESSAGE = req.flash("SUCCESS_MESSAGE");
  app.locals.ERROR_MESSAGE = req.flash("ERROR_MESSAGE");
  app.locals.errors = req.flash("errors");
  app.locals.error = req.flash("error");
  next();
});

//!============================= USING OTHER ROUTE MIDDLEWARE STARTS=======================//
//this is use to call path , when click it use the model path which we are

// here /Employee is static path(goes to route)
//the syntax app.use(path,miiddleware)
app.use("/Employee", EmployeeRoute);
app.use("/auth", AuthRoute);
//listen port
//!============================= USING OTHER ROUTE MIDDLEWARE ENDS=======================//
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`app is running on port number ${PORT}`);
});
