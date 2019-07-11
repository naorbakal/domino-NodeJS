
const roomsList = new Array();

function getLobbyRooms(){
    return JSON.stringify(roomsList);
}

function addUserToRoom(req,res,next){
    request = JSON.parse(req.body);
    roomsList.forEach((room)=>{
        if (room.Id === request.roomId){
            room.players.push(request.userName);
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
   module.exports = {addRoomToList, getLobbyRooms, addUserToRoom}
    

