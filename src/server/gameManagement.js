const express = require('express');
const gameManagementAuth = require('./gameManagementAuth');

const gameManagement = express.Router();

gameManagement.post('/startGame',gameManagementAuth.startGame ,(req, res,next) => {
    res.sendStatus(200);
});
gameManagement.post('/getGameData',gameManagementAuth.getGameData);
module.exports = gameManagement;