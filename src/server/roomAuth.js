
const roomsList = new Array();

function getLobbyRooms(){
    return JSON.stringify(roomsList);
}

function addUserToRoom(req,res,next){
    request = JSON.parse(req.body);
    roomsList.forEach((room)=>{
        if (room.Id === request.roomId){
            room.players.push(request.userName);
            if(room.amountOfPlayers === room.players.length){
                room.started = true;
            }
            next();
        }
    });
}

function addRoomToList(req, res, next) {
    let err = false;
    const request = JSON.parse(req.body);
    if(request.name === undefined || request.name === '' || !request.name.trim()){
        res.status(405).send('name not allowed');
        err = true;
        return;
	}
      roomsList.forEach((room)=>{
          if (room.Id === request.name){
            res.status(403).send('A room with the same name already exist');
            err = true;
            return;
          }
      });
      if(!err){
	    roomsList.push({
            Id: request.name,
            creator: request.creator,
            amountOfPlayers: request.amountOfPlayers,
            players: new Array(),
            started: false
        }); 
        next();
    }
            
    }

  function checkRoomFull(req, res, next){
    let err = true;
    const request = JSON.parse(req.body);
    roomsList.forEach((room)=>{
        if (room.Id === request.name){
            res.json(JSON.stringify({started:room.started}));
            err=false;
            return
        }
    });
    if(err){
        res.sendStatus(401);
    } 
    
  }  

  function getRoomPlayers(roomId){
    let players=null;
    roomsList.forEach((room)=>{
        if (room.Id === roomId){
            players= room.players;
        }
    });
    return players;    
}

  function exitRoom(req, res, next){
    const request = JSON.parse(req.body);

    roomsList.forEach(room => {
        if( room.Id === request.name){
            for(var i=0; i<room.players.length; i++){
                if(room.players[i] === request.playerToRemove){
                   room.players.splice(i,1);
                   break;
                }
            }
        }
    })
    
    next();
  }


   module.exports = {addRoomToList, getLobbyRooms, addUserToRoom,checkRoomFull, exitRoom, getRoomPlayers}
    

