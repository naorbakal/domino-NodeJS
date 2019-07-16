
const userData = require('./userData');
const userList = {};

function userAuthentication(req, res, next) {		
	if (userList[req.session.id] === undefined) {				
		res.sendStatus(401);		
	} else {		
		next();
	}
}

function addUserToAuthList(req, res, next) {	
	if (userList[req.session.id] !== undefined) {
		res.status(403).send('user already exist');
	} else {		
		for (sessionid in userList) {
			const name = userList[sessionid].name;
			if (name === req.body) {
				res.status(403).send('user name already exist');
				return;
			}
		}		
		userList[req.session.id] = new userData(req.body,"lobby");
		next();
	}
}

function removeUserFromAuthList(req, res, next) {	
	if (userList[req.session.id] === undefined) {
		res.status(403).send('user does not exist');
	} else {						
		delete userList[req.session.id];
		next();
	}
}

function getUserInfo(id) {	
    return  JSON.stringify(userList[id]);
}

function updateUserData(req,res,next){
	const requestBody = JSON.parse(req.body);
	console.log(requestBody);
	for (sessionid in userList) {
		const name = userList[sessionid].name;
		if (name === requestBody.name) {
			console.log(userList[sessionid]);
			userList[sessionid].updateUserData(requestBody.name,requestBody.location, requestBody.roomId);
			console.log(userList[sessionid]);
		}
		next();
	}
}
function removeUserFromAuthList(req, res, next) {
		if (userList[req.session.id] === undefined) {
			res.status(403).send('user does not exist');
		} else {						
			delete userList[req.session.id];
			next();
		}
	}

module.exports = {userAuthentication, addUserToAuthList, removeUserFromAuthList, getUserInfo, updateUserData,removeUserFromAuthList};
