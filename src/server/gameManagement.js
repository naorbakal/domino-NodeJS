const express = require('express');
const gameManagementAuth = require('./gameManagementAuth');

const gameManagement = express.Router();

gameManagement.post('/startGame',gameManagementAuth.startGame ,(req, res,next) => {
    res.sendStatus(201);
});

gameManagement.post('/firstPlayer',gameManagementAuth.firstPlayer ,(req, res,next) => {
    res.sendStatus(200);
});
gameManagement.post('/setWinner',gameManagementAuth.setWinner);

gameManagement.post('/outOfPlays',gameManagementAuth.outOfPlays);


gameManagement.post('/whosTurn',gameManagementAuth.whosTurn ,(req, res,next) => {
    res.sendStatus(200);
});
gameManagement.post('/checkEndGame',gameManagementAuth.checkEndGame);


gameManagement.post('/checkBoardUpdate',gameManagementAuth.checkBoardUpdate);

gameManagement.post('/updateGame',gameManagementAuth.updateGame ,(req, res,next) => {
    res.sendStatus(200);
});
gameManagement.post('/getGameData',gameManagementAuth.getGameData);

module.exports = gameManagement;