'use strict';
var crypto = require('crypto');

var genRandomString = function(length){
   	return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};
//Hashing
var sha512 = function(password, salt){
	var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
	hash.update(password);
	var value = hash.digest('hex');
	return {
		salt:salt,
		passwordHash:value
	};	
};
//Salt
function saltHashPassword(password, salt) {
		//var salt = genRandomString(16); 	//Generate Salt (Used for create new user, need AJAX fixed first though)
		//var salt = "1e5c4802aa3964e1"; // Salt for password "ädmin" (Temporary until AJAX fixed)
	var passwordData = sha512(password, salt);
	//console.log('UserPassword = '+password);
	//console.log('Passwordhash = '+passwordData.passwordHash);
	//console.log('nSalt = '+passwordData.salt);
	return passwordData;
}

//Connect DB??

module.exports = {
	authorize:function(password, dBPassword, salt){
		//console.log(dBPassword);
		//console.log(password);
		var passwordData = saltHashPassword(password, salt);
		//console.log(getAccounts());
		if(passwordData.passwordHash==dBPassword){
			return true;
		}
	},

	createUser:function(username, password){
		var urlRoot='https://api.jsonbin.io/b/5afe0ac37a973f4ce578402e/latest';
		var existingUser = false;
		//Generate new salt
		var salt = genRandomString(16);
		//Hash password
		var hashedPass = sha512(password, salt).passwordHash;
		//Prepare to pull user accounts data
		const request = require("request"); 
		const getConfig = {
			method:'GET',
			url:urlRoot,
			headers: { //Required only if you are trying to access a private bin
				'secret-key': '$2a$10$1HpPJq1WeTekrcJQSquSwegUqa1zQsIFKncdt7QC7oHIuLqua7vgW'
			},
			json:true
		};
		//User Accounts Data
		request(getConfig, function(err, response, accountData){
			//Check if user already exists
			for(let i=0; i<accountData.length; i++){
				if (username.toLowerCase() == accountData[i].user.toLowerCase()){
					existingUser=true;
				}
			}
			if(!existingUser){
				//Add New User to Users List
				accountData.push({"user":username, "pass":hashedPass, "salt":salt, "lists":[]});
				console.log(accountData);//display new data
				//Send data back to server
				const configPUT = {
					method:'PUT',
					url:'https://api.jsonbin.io/b/5afe0ac37a973f4ce578402e',
					headers: { //Required only if you are trying to access a private bin
						'content-type': 'application/json',
						'secret-key': '$2a$10$1HpPJq1WeTekrcJQSquSwegUqa1zQsIFKncdt7QC7oHIuLqua7vgW',
					},
					json:accountData
				}
				//Send Data Back To Server
				request(configPUT, function(err, reqResponse, data){
					console.log(reqResponse.statusCode);
					console.log(data.success);
					console.log(data.version);
				});
			}
			else{
				console.log("Username already exists");
			}
		});
	}
}
