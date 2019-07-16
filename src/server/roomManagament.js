const express = require('express');
const roomAuth = require('./roomAuth');

const roomManagement = express.Router();

roomManagement.get('/',  (req, res) => {
	const lobbyRooms = roomAuth.getLobbyRooms();
	res.json(lobbyRooms);
});

roomManagement.post('/addRoom', roomAuth.addRoomToList, (req, res) => {		
	res.sendStatus(200)});

roomManagement.post('/enterRoom', roomAuth.addUserToRoom, (req,res,next) => {
	res.sendStatus(200)});

roomManagement.post('/checkRoomFull', roomAuth.checkRoomFull);

roomManagement.post('/exitRoom', roomAuth.exitRoom, (req, res, next) => {
	res.sendStatus(200)});
	

module.exports = roomManagement;