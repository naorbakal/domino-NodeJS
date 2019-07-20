const express = require('express');
const auth = require('./auth');

const userManagement = express.Router();

userManagement.get('/', auth.userAuthentication, (req, res) => {
	const userinfo = auth.getUserInfo(req.session.id);
	res.json(userinfo);
});

userManagement.get('/list', (req,res) => {
	let userNames = auth.getUsers();
	res.json(userNames);
});

userManagement.post('/addUser', auth.addUserToAuthList, (req, res) => {		
	res.sendStatus(200);	
});

userManagement.post('/updateUser', auth.updateUserData, (req, res, next) => {		
	res.sendStatus(200);
});

userManagement.get('/logout',
	auth.removeUserFromAuthList,
	(req, res) => {
		res.sendStatus(200);		
	}
);

module.exports = userManagement;