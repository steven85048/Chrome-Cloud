var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

// configure database

mongoose.connect(configDB.url);
require('./config/passport')(passport);

// set up express

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs')

// initialize passport

app.use(session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// configure routes

require('./app/routes.js')(app, passport);

// start

app.listen('8000');