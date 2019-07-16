const roomAuth = require('./roomAuth');

const games = new Map();

function startGame(req,res,next){
    let players = roomAuth.getRoomPlayers(req.body.roomId);
    if(games.get(req.body.roomId) === undefined){
        games.set(req.body.roomId,{players:players,boardTiles:null,dominoTiles:null, turn:0});
        next();
    }
    else{
        res.sendStatus(200);
    }

}

function whosTurn(req,res,next){
    console.log(req.body);
    const game=games.get(req.body.roomId);
    const player = games.players[game.turn];
    res.json({player:player})
}

function updateGame(req,res,next){
    const game=games.get(req.body.roomId);
    ++game.turn;
    if(game.turn === game.players.length()){
        game.turn = 0;
    }
    games.set(req.body.roomId,{players:players,boardTiles:req.body.boardTiles,dominoTiles:req.body.dominoTiles,turn:game.turn});
    next();
}

function getGameData(req,res,next){
    let game=games.get(req.body.roomId)
    res.json(game);
}

module.exports = {startGame, getGameData, updateGame, whosTurn}

