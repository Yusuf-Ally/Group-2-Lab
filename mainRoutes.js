let path = require('path');
let express = require('express');
let mainRouter = express.Router();
var fs = require('fs');

//Declaration of Variables
let Lists = fs.readFileSync('showlist.json');
let List = JSON.parse(Lists);
let availableLists = [];
let currentList = "";

var authenticator = require('./Public/Scripts/authorize.js'); //cant get it to work with CDN just yet
var listManager = require('./Public/Scripts/listManager.js'); //cant get it to work with CDN just yet
var loggedIn = false;
var pswdError = false;
var loggedInUser = "";
var username = "";
//Define Config to access database on JSONBin
const request = require("request");
const config = {
	method: 'GET',
	url: 'https://api.jsonbin.io/b/5afe0ac37a973f4ce578402e/latest',
	headers: { //Required only if you are trying to access a private bin
		'secret-key': '$2a$10$1HpPJq1WeTekrcJQSquSwegUqa1zQsIFKncdt7QC7oHIuLqua7vgW'
	},
	json: true
};
//Defining Routes
//Authentication Routes
mainRouter.get('/', function(req, res) {
	loggedIn = false;
	res.sendFile(path.join(__dirname, 'views', 'welcome.html'));
});

mainRouter.post('/', function(req, res) {
	if (req.body.usr != "" && req.body.pass != "") {
		//Get data from the database
		request(config, function(err, reqResponse, body) {
			username = req.body.usr;
			//console.log(body);
			for (let i = 0; i < body.length; i++) {
				if (body[i].user == username) {
					if ( reqResponse.statusCode == "200") {
						//console.log(authenticator.authorize(req.body.pass, body[i].pass, body[i].salt)); Test
						if (authenticator.authorize(req.body.pass, body[i].pass, body[i].salt)) {
							availableLists = body[i].lists;
							loggedIn = true;
							res.redirect('/lists');
						} else {
							console.log("Error! Incorrect Username or Password!");
							pswdError = true;
							res.redirect('/');
						}
					}
					break; //Exit for loop
				}
			}
		});
	}
});

mainRouter.post('/reg', function(req, res) {
	if (req.body.passRepeat == req.body.passwordReg && req.body.userReg != "" && req.body.passwordReg != "") {
		console.log("Creating user ...");
		authenticator.createUser(req.body.userReg, req.body.passwordReg);
		res.redirect('/');
	} else {
		res.redirect('/');
	}
});

mainRouter.post('/logout', function(req, res) {
	loggedIn = false;
	res.redirect('/');
});

//List Screen Routes
mainRouter.get('/lists', function(req, res) {
	//Show homepage with lists
	//Get Username from Login Module, request lists for that user.
	if (loggedIn) {
		loggedInUser = username;
		res.sendFile(path.join(__dirname, 'views', 'lists.html'));
	} else {
		res.redirect('/');
	}
});

mainRouter.get('/getUser', function(req, res) {
	res.send(loggedInUser);
});

mainRouter.get('/getAvailableLists', function(req, res) {
	res.send(availableLists);
});

//RESTful api
mainRouter.get('/list', function(req, res) {
	if (loggedIn)
		res.sendFile(path.join(__dirname, 'views', 'list.html'));
	else
		res.redirect('/');
});

mainRouter.get('/currentlist', function(req, res) {
	res.send(currentList);
});

mainRouter.get('/showlist', function(req, res) {
	res.json(List); //Respond with JSON
});

mainRouter.post('/createList', function(req, res) {
	//update DB and Lists page with new list
	currentList = req.body.listname;
	Lists = fs.readFileSync('showlist.json');
	List = JSON.parse(Lists);
	var newList = { listName: currentList, items: [] };
	var listExists = false;
	//Update Available lists Array for Viewing
	if(availableLists.includes(newList.listName)==false || availableLists==[])
		availableLists.push(newList.listName);
	//Look For Current List
	for (x in List) {
		if (List[x].listName == currentList) {
			res.redirect('/list'); //Then Edit List
			listExists = true;
			break;
		}
	}
	if (listExists == false) {
		console.log("Writing new list");
		List.push(newList);
		Lists = fs.writeFileSync('showlist.json', JSON.stringify(List)); //Then Create New List
		//Automatically share list with currently logged in user
		listManager.shareList(loggedInUser, newList.listName);
		res.redirect('/lists');
	}

});

mainRouter.post('/list', function(req, res) {
	//Create new item object
	var item = { itemName: req.body.name, itemCategory: req.body.cat, itemQuantity: req.body.quantity };
	//Look For Current List
	for (x in List) {
		if (List[x].listName == currentList) {
			//Reject adding empty item,character limiting is done in html
			if (item.itemName != "") {
				List[x].items.push(item);
				Lists = fs.writeFileSync('showlist.json', JSON.stringify(List));
				res.redirect('/list'); //Then refresh List
				break;
			} else {
				res.redirect('/list');
				break;
			}
		}
	}
});

//item Deletion
mainRouter.get('/list/delete/:id', function(req, res) {
	var itemID = req.params.id;
	var isDeleting = true;
	var delID = 0;
	//var delID=0;
	//get current List
	for (x in List) {
		if (List[x].listName == currentList) {
			//Get index value corresponding to item delete button
			for (item in List[x].items) {
				if (List[x].items[item].itemName == itemID) {
					var delID = item;
					isDeleting = true;
				}
			}
			//Remove item from List[]
			if (isDeleting) {
				List[x].items.splice(delID, 1);
				Lists = fs.writeFileSync('showlist.json', JSON.stringify(List));
				//Send index value for html row delete
				res.send(delID.toString());
			}
			break;
		}
	}
});

//List Deletion
mainRouter.get('/list/deleteList/:id', function(req, res) {
	var listID = req.params.id;
	var delID = 0;

	//Update Available lists Array for Viewing
	for(list in availableLists){
		if(availableLists[list]==listID)
			availableLists.splice(list, 1);
	}
	//get current List
	for (x in List) {
		if (List[x].listName == listID) {
			delID = x;
			//Delete Links to List From USERDB
			listManager.delListLinks(listID);
			//Remove list from Lists[]
			List.splice(delID, 1);
			Lists = fs.writeFileSync('showlist.json', JSON.stringify(List));
			//Send index value for html row delete
			res.send(delID.toString());
			break;
		}
	}
	res.redirect('lists');
});

//List Sharing Function
mainRouter.post('/shareList', function(req, res) {
	var userToShare = req.body.shareUserID;
	var listToShare = currentList;

	listManager.shareList(userToShare, listToShare);

	res.redirect('/list');
})
module.exports = mainRouter;
