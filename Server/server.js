var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var express = require('express');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, WriteObject, Folder, Login, Password, ItemID");
  next();
});

app.get('/login', function(req, res){
	var user = req.get("Login");
	var pass = req.get("Password");
	
	
});

app.get('/getbyfolder', function(req, res){
	var folder = req.get("Folder");
});

app.get('/addToDatabase', function(req, res){
	var object = req.get("WriteObject");
});

app.get('/deleteByID', function(req, res){
	var itemID = req.get("ItemID");
});

// initialize server

var options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem'),
	passphrase: "terry987"
};

console.log("App listening on ");
https.createServer(options, app).listen('8000', '192.168.1.2' );