const roomAuth = require('./roomAuth');

const games = new Map();

function startGame(req,res,next){
    const request = JSON.parse(req.body);
    let players = roomAuth.getRoomPlayers(request.roomId);
    if(games.get(request.roomId) === undefined){
        games.set(request.roomId,{players:players,boardTiles:null,dominoTiles:null, turn:0});
        next();
    }
    else{
        res.sendStatus(200);
    }

}

function firstPlayer(req,res,next){
    const request = JSON.parse(req.body);
    const game = games.get(request.roomId);
    res.json({firstPlayer:game.players[0]});
}

function whosTurn(req, res, next){
    const request = JSON.parse(req.body);
    const game = games.get(request.roomId);
    const player = game.players[game.turn];
    res.json({player:player})
}


function updateGame(req,res,next){
    const request = JSON.parse(req.body);
    const game=games.get(request.roomId);
    ++game.turn;
    if(game.turn === game.players.length){
        game.turn = 0;
    }
    games.set(request.roomId,{players:game.players,boardTiles:request.boardTiles,dominoTiles:request.dominoTiles,turn:game.turn});
    next();
}

function getGameData(req,res,next){
    const request = JSON.parse(req.body);
    let game=games.get(request.roomId)
    res.json(game);
}

module.exports = {startGame, getGameData, updateGame, whosTurn, firstPlayer}

