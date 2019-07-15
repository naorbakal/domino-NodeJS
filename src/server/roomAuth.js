
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
   module.exports = {addRoomToList, getLobbyRooms, addUserToRoom,checkRoomFull}
    

