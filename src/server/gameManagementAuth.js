const roomAuth = require('./roomAuth');

const games = new Map();

function startGame(req,res,next){
    let players = roomAuth.getRoomPlayers(req.body.roomId);
    games.set(req.body.roomId,{players:players,boardTiles:req.body.boardTiles,dominoTiles:req.body.dominoTiles});
    next();
}

function getGameData(req,res,next){
    let game=games.get(req.body.roomId)
    res.json(game);
}

module.exports = {startGame, getGameData}

