class UserData{
    constructor(name, location){
        this.name=name,
        this.location= location,
        this.roomId = null
    }
    updateUserData(name, location, roomId=null){
        this.name = name;
        this.location = location;
        this.roomId = roomId;
    }
}

module.exports = UserData;