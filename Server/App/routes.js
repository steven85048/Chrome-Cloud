var _ = require('underscore');

module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('home.ejs');
	});
	
	// HANDLES USER LOGIN
	
	app.get('/login', function(req, res){
		res.render('login.ejs', {message : req.flash('loginMessage')});
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', 
		failureRedirect : '/login',
		failureFlash : true,
	}));
	
	// HANDLES USER SIGNUP
	
	app.get('/signup', function(req, res){
		res.render('signup.ejs', {message : req.flash('loginMessage')});
	});
		
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup', 
		failureFlash : true,
	}));
	
	// HANDLES USER PROFILE - ONLY ALLOW ACCESS IF AUTHENTICATED
	
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', {
			user : req.user
		});
	});
	
	// OBTAINS HEADERS AND WRITES OBJECT INTO DATABASE
	
	app.get('/write', isLoggedIn, function(req, res) {		
		var dataAsString = req.get("Data");
		var inData = JSON.parse(dataAsString);
		
		var user = req.user;
				
		var enteredFolder = inData.folder;
		delete inData.folder;
		
		// loops through folders connected through user
		var completed = false;
		for (var i = 0 ; i < user.data.length; i++) {
			if(user.data[i].folder == enteredFolder){
				user.data[i].content.push(inData);
				
				completed = true;
				
				user.save(function(){
					res.end(JSON.stringify(dataAsString));
				});
				break;
			}
		}
		
		// if no corresponding folder found, create new folder
		if (!completed){
			var template = {folder: enteredFolder, content: [inData]};
			user.data.push(template);
			
			user.save(function(){
				res.end(JSON.stringify(dataAsString));
			});	
		}
	});
	
	// HANDLES THE DELETE OF IMAGES
	
	app.get('/delete', isLoggedIn, function(req, res) {
		var idsToDelete = req.get("IDDelete");
		var user = req.user;
		
		// using the ids, delete the element
		
	});
	
	// HANDLES THE MOVEMENT OF OBJECTS
	
	app.get('/move', isLoggedIn, function(req, res) {
		var idsToMove = req.get("IDMove");
	});
	
	// HANDLES DOWNLOAD OF FOLDER
	
	app.get('/downloadFolder', function(req, res) {
		
	});
	
	// HANDLES LOGOUT OF USER
	
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/login');
	});
	
	// AJAX route to obtain user data
	
	app.get('/data', isLoggedIn, function(req, res) {
		res.send(JSON.stringify(req.user));
	});
	
};

function deleteIdsFromFolder(objIds, folder, user) {
	
}

function isLoggedIn(req, res, next){
	if (req.isAuthenticated())
		return next();
	
	res.redirect('/login');
}