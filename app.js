//- File Name: apps.js
//- Author: Steven Davies
//- Website Name: www.sdavies.ca
//- Description: This is the app.js for the site and contains all the required in modules.
//- Updated : 2019-10-13
// Vairable Definitions
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// add the session 
var session = require("express-session");
// add coneection to mongoose
var mongoose = require("mongoose");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var User = require('./models/user');

const bodyParser = require('body-parser')

// Create the APP instance
var app = express();

mongoose.connect(
  'mongodb+srv://test:test@comp2068-qabzd.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

var db = mongoose.connection;

db.on("error", () => console.log("There was a connection error"));
db.once("open", () => console.log("Connected to the DB"));

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

// body parser for nodemailer.
app.use(bodyParser.urlencoded({ extended: true }))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'unicorn',
    resave: false,
    saveUninitialized: true
  })
);

app.use(flash());

// create the passport reference and initialize passport

app.use(passport.initialize());
app.use(passport.session());

// use the passport reference

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
