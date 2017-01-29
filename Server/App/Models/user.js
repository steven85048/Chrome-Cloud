var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local : {
		email : String,
		password : String,
	},
	
	data : [{
		folder: String,
		content : [{
			objType : String,
			content : String, 
			dateAdded : String,
			objName : String,
			description : String,
		}]
	}]}, { minimize : false });

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);