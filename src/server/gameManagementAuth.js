const roomAuth = require('./roomAuth');

const games = new Map();

let wasAwinner = false;


function startGame(req,res,next){
    const request = JSON.parse(req.body);
    let players = roomAuth.getRoomPlayers(request.roomId);
    players = players.map((player)=>{
        return {player:player,statistics:null};
    })
    let winners=new Array();
    if(games.get(request.roomId) === undefined){
        games.set(request.roomId,{players:players,boardTiles:null,dominoTiles:null, turn:0
        ,winners:winners,outOfPlays:new Array(),endGame:false});
        next();
    }
    else{
        res.sendStatus(200);
    }
}

function outOfPlays(req,res,next){
    const request = JSON.parse(req.body); 
    const game = games.get(request.roomId);
    game.outOfPlays.push(request);
    if(game.outOfPlays === game.players.length){
            game.outOfPlays.sort((a,b)=>{
                return a.statistics.score-b.statistics.score;
            });
            game.endGame=true;
    }
    swapPlayers(game);
    res.json({endGame:game.endGame})
}

function adjustNextPlayerIndex(nextPlayerName,game){
    let index=game.players.map((e) =>{ return e.player; }).indexOf(nextPlayerName);  
    game.turn=index;   
}
function setWinner(req,res,next){
    wasAwinner = true;
    let index;
    let nextPlayerName;
    const request = JSON.parse(req.body); 
    const game = games.get(request.roomId);
    game.winners.push(request);
    swapPlayers(game);
    nextPlayerName=game.players[game.turn].player;
    index=game.players.map((e) =>{ return e.player; }).indexOf(request.name);     
    game.players.splice(index, 1)
    adjustNextPlayerIndex(nextPlayerName,game);
    if(game.players.length === 1){
        game.outOfPlays.push(game.players[0]);
        game.endGame=true;
    }
    res.json({winnerNumber:game.winners.length,endGame: game.endGame});
}

function checkBoardUpdate(req,res,next){
    const request = JSON.parse(req.body); 
    const game = games.get(request.roomId);

    res.json({boardTiles:game.boardTiles,endGame:game.endGame});
}

function checkEndGame(req,res,next){
    const request = JSON.parse(req.body); 
    const game = games.get(request.roomId);

    res.json({endGame:game.endGame,winners:game.winners,outOfPlays:game.outOfPlays});
}
function firstPlayer(req,res,next){
    const request = JSON.parse(req.body);
    const game = games.get(request.roomId);
    res.json({firstPlayer:game.players[0].player});
}

function whosTurn(req, res, next){
    const request = JSON.parse(req.body);
    const game = games.get(request.roomId);
    const player = game.players[game.turn];
    res.json({player: player, boardTiles:game.boardTiles, endGame:game.endGame,
     outOfPlays: game.outOfPlays, winners: game.winners});
}


function updateGame(req,res,next){
    const request = JSON.parse(req.body);
    const game=games.get(request.roomId);
    if(!wasAwinner){
        swapPlayers(game);
        wasAwinner = false;
    }
    let index=game.players.map((e) =>{ return e.player; }).indexOf(request.player); 
    if(index !==-1){
        game.players[index].statistics = request.statistics;  
        games.set(request.roomId,{players:game.players,boardTiles:request.boardTiles,dominoTiles:request.dominoTiles,turn:game.turn
            ,winners:game.winners,outOfPlays:new Array(),endGame:game.endGame});
        
        }
        next();     
}

function getGameData(req,res,next){
    const request = JSON.parse(req.body);
    let game=games.get(request.roomId)
    res.json(game);
}

function swapPlayers(game){
    ++game.turn;
    if(game.turn === game.players.length){
        game.turn = 0;
    }
}

module.exports = {startGame,checkEndGame, getGameData, updateGame, whosTurn, firstPlayer, setWinner,outOfPlays,checkBoardUpdate}

