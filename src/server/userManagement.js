const express = require('express');
const auth = require('./auth');

const userManagement = express.Router();

userManagement.get('/', auth.userAuthentication, (req, res) => {
	const userName = auth.getUserInfo(req.session.id).name;
	res.json({name:userName});
});

userManagement.post('/addUser', auth.addUserToAuthList, (req, res) => {		
	res.sendStatus(200);	
});

module.exports = userManagement;