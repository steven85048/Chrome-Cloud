var _ = require('underscore');
var mongoose = require('mongoose');

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
		
		// convert single data element to array
		var inDataAsArray = [inData];
		
		writeData(inDataAsArray, enteredFolder, user);
		
		// save mondified user
		user.save(function(){
			res.end(JSON.stringify(dataAsString));
		});	
	});
	
	// HANDLES THE DELETE OF IMAGES
	
	app.get('/delete', isLoggedIn, function(req, res) {
		
		var idsFromHeader = JSON.parse(req.get("IDDelete"));
		var folder = req.get("folder");
		
		var idsToDelete = idsFromHeader.ids;
		
		var user = req.user;
				
		// using the ids, delete the element
		deleteIdsFromFolder(idsToDelete, folder, user);
		
		user.save(function(){
			res.end("Deleted Element");
		});
	});
	
	// RETURN ARRAY OF ALL FOLDERS
	
	app.get('/folderList', isLoggedIn, function(req, res){
		var user = req.user;
		
		var folderArray = [];
		for (var i = 0 ; i < user.data.length; i++)
			folderArray.push(user.data[i].folder);
		
		res.end(JSON.stringify(folderArray));
			
	});
	
	// ADDS NEW FOLDER TO LIST
	
	app.get('/addFolder', isLoggedIn, function(req, res) {
		var addFolder = req.get("addFolder");
		var user = req.user;
		
		var template = {folder: addFolder, content: []};
		user.data.push(template);
		
		user.save(function(){ res.end("Added Folder!")});
	});
	
	// HANDLES THE MOVEMENT OF OBJECTS
	
	app.get('/move', isLoggedIn, function(req, res) {
		var idsToMove = req.get("IDMove");
		var currFolder = req.get("fromFolder");
		var destFolder = req.get("toFolder");
		
		var user = req.user;
		
		// using the ids, delete the elements in the current folder
		var dataToMove = deleteIdsFromFolder(idsToMove, currFolder, user);
		
		// move the data to the specified folder
		writeData(dataToMove, destFolder, user);
		
		user.save(function(){
				res.end(JSON.stringify(dataAsString));
			});		
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

function writeData(inData, enteredFolder, user) {
	// loop through folders to find matching folder
	var completed = false;
	for (var i = 0 ; i < user.data.length; i++) {
		if(user.data[i].folder == enteredFolder){
			// if matching, push data to selected folder
			for (var j = 0 ; j < inData.length; j++)
				user.data[i].content.push(inData[j]);
			
			completed = true;
			break;
		}
	}
	
	// if no corresponding folder found, create new folder
	if (!completed){
		var template = {folder: enteredFolder, content: inData};
		user.data.push(template);
	}
}

function deleteIdsFromFolder(objIds, enteredFolder, user) {
	// get folder corresponding to input
	for (var i = 0 ; i < user.data.length; i++) {
		if(user.data[i].folder == enteredFolder){
			var folderContents = user.data[i].content;
			var removedObjects = [];
		
			// loop through object Ids
			for (var j = 0 ; j < objIds.length; j++){
				// find element corresponding to object id
				var objId = mongoose.Types.ObjectId(objIds[j]);
				for (var k = 0 ; k < folderContents.length; k++){
					// replace objects corresponding to the object id and push to array
					var currObj = folderContents[k];
					if (currObj._id.equals(objId)){
						folderContents = _.without(folderContents, currObj);
						removedObjects.push(currObj);
						break;
					}
				}
			}
						
			// update original array
			user.data[i].content = folderContents;
			return removedObjects;
		}
	}
	
	return null;
}

function isLoggedIn(req, res, next){
	if (req.isAuthenticated())
		return next();
	
	res.redirect('/login');
}