const roomAuth = require('./roomAuth');

const games = new Map();


function startGame(req,res,next){
    const request = JSON.parse(req.body);
    let players = roomAuth.getRoomPlayers(request.roomId);
    let winners=new Array();
    let outOfPlays=new Array();
    let looser=" ";
    if(games.get(request.roomId) === undefined){
        games.set(request.roomId,{players:players,boardTiles:null,dominoTiles:null, turn:0
        ,winners:winners,outOfPlays:outOfPlays,looser:looser,endGame:false});
        next();
    }
    else{
        res.sendStatus(200);
    }
}

function outOfPlays(req,res,next){
    const request = JSON.parse(req.body); 
    const game = games.get(request.roomId);
    game.outOfPlays.push({playe:request.name,score:request.score})
    if(game.outOfPlays === game.players.length){
            //sort outOfpLayes
            game.endgame=true;
    }
    res.json({endGame:game.endgame})

}

function setWinner(req,res,next){
    let index;
    const request = JSON.parse(req.body); 
    const game = games.get(request.roomId);
    if(game.players.length !== game.winners.length + 1){
        game.winners.push(req.name);
        index = game.players.indexOf(req.name);
        game.players.splice(index, 1)
    }
    if(game.players.length === 1){
        game.looser = game.players[0];
        game.endgame=true;
    }
    res.json({winnerNumber:game.winners.length,endGame: game.endgame});
}

function checkBoardUpdate(req,res,next){
    const request = JSON.parse(req.body); 
    const game = games.get(request.roomId);

    res.json(game.boardTiles);
}

function checkEndGame(req,res,next){
    const request = JSON.parse(req.body); 
    const game = games.get(request.roomId);

    res.json(game.endGame);
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
    res.json({player:player,boardTiles:game.boardTiles});
}


function updateGame(req,res,next){
    const request = JSON.parse(req.body);
    const game=games.get(request.roomId);
    ++game.turn;
    if(game.turn === game.players.length){
        game.turn = 0;
    }
    games.set(request.roomId,{players:game.players,boardTiles:request.boardTiles,dominoTiles:request.dominoTiles,turn:game.turn
        ,winners:game.winners,outOfPlays:game.outOfPlays,looser:game.looser,endGame:game.endGame});
    
    next();
}

function getGameData(req,res,next){
    const request = JSON.parse(req.body);
    let game=games.get(request.roomId)
    res.json(game);
}

module.exports = {startGame,checkEndGame, getGameData, updateGame, whosTurn, firstPlayer, setWinner,outOfPlays,checkBoardUpdate}

