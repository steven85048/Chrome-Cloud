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

// allow X Http Requests
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Data, folder, IDDelete, IDMove, fromFolder, toFolder, addFolder');
	
	if ('OPTIONS' == req.method) {
		 res.send(200);
	} else {
		next();
	}
});

// configure database

mongoose.connect(configDB.url);
require('./config/passport')(passport);

// set up express


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs')

// initialize passport

app.use(session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// configure routes

require('./app/routes.js')(app, passport);

// start

var port_number = (process.env.PORT || 3000);
app.listen(port_number);