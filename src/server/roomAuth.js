
const roomsList = new Array();

function getLobbyRooms(){
    return JSON.stringify(roomsList);
}

function addRoomToList(req, res, next) {
    console.log(typeof(req.body));		
    const request = JSON.parse(req.body);
      roomsList.forEach((room)=>{
          if (room.Id === request.name){
            res.status(403).send('A room with the same name already exist');
            return;
          }
      });   
	    roomsList.push({
            Id: request.name,
            creator: request.creator,
            amountOfPlayers: request.amountOfPlayers,
            players: new Array(),
            started: false
        });
        next();     
    }
   module.exports = {addRoomToList, getLobbyRooms}
    

