const request = require("request");
const configGET = {
	method: 'GET',
	url: 'https://api.jsonbin.io/b/5afe0ac37a973f4ce578402e/latest',
	headers: { //Required only if you are trying to access a private bin
		'secret-key': '$2a$10$1HpPJq1WeTekrcJQSquSwegUqa1zQsIFKncdt7QC7oHIuLqua7vgW'
	},
	json: true
};

const configPUT = {
	method: 'PUT',
	url: 'https://api.jsonbin.io/b/5afe0ac37a973f4ce578402e',
	headers: { //Required only if you are trying to access a private bin
		'content-type': 'application/json',
		'secret-key': '$2a$10$1HpPJq1WeTekrcJQSquSwegUqa1zQsIFKncdt7QC7oHIuLqua7vgW',
	},
	//json: accountData
}

module.exports = {
	delListLinks: function(listID) {
		request(configGET, function(err, response, accountData) {
				//Check if user already exists
				for (i in accountData) {
					for (list in accountData[i].lists) {
						if (accountData[i].lists[list] == listID) {
							accountData[i].lists.splice(list, 1);
						}
					}
				}

				//Send Data Back To JSON bin
				console.log(accountData); //display new data
				const configPUT = {
					method: 'PUT',
					url: 'https://api.jsonbin.io/b/5afe0ac37a973f4ce578402e',
					headers: { //Required only if you are trying to access a private bin
						'content-type': 'application/json',
						'secret-key': '$2a$10$1HpPJq1WeTekrcJQSquSwegUqa1zQsIFKncdt7QC7oHIuLqua7vgW',
					},
					json: accountData
				}
				//Send Data Back To Server
				request(configPUT, function(err, reqResponse, data) {
					console.log(reqResponse.statusCode);
					console.log(data.success);
					console.log(data.version);
				}); 
		});
	},
	shareList:function(user, newList){
		request(configGET, function(err, response, accountData) {
				var listFound = false;
				//Check the appropriate user
				for (i in accountData) {
					listFound = false;
					if(accountData[i].user==user){
						//check if user already has access to the list
						for(list in accountData[i].lists){
							if(accountData[i].lists[list] == newList){
								listFound=true;	//list has been found, no need to edit this user
								break;
							}
						}
						if(listFound == false){
							accountData[i].lists.push(newList);
							break;
						}
					}
				}

				//Send Data Back To JSON bin
				console.log(accountData); //display new data
				
				if(!listFound){ //Only resend data if a new list has been shared
					const configPUT = {
						method: 'PUT',
						url: 'https://api.jsonbin.io/b/5afe0ac37a973f4ce578402e',
						headers: { //Required only if you are trying to access a private bin
							'content-type': 'application/json',
							'secret-key': '$2a$10$1HpPJq1WeTekrcJQSquSwegUqa1zQsIFKncdt7QC7oHIuLqua7vgW',
						},
						json: accountData
					}
					//Send Data Back To Server
					request(configPUT, function(err, reqResponse, data) {
						console.log(reqResponse.statusCode);
						console.log(data.success);
						console.log(data.version);
					}); 
				}
		});	
	}
}