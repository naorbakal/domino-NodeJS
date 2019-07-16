import React from 'react';
import Room from './room.js';
import ReactDOM from 'react-dom';

export default class Lobby extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showAddRoom : false,
            rooms : null,
            errMessage: ''
        };

        this.getRooms();

        this.handleAddRoom = this.handleAddRoom.bind(this);
        };

        getRooms() {
            this.fetchRoomsInfo()
            .then(roomsInfo => {
                if(roomsInfo.length !== 0){
                let roomsArr = JSON.parse(roomsInfo);
                this.setState(()=>({rooms: roomsArr}));
                }
            })
            .catch(err=>{            
                if (err.status !== 401) { // incase we're getting 'unautorithed' as response
                    throw err; // in case we're getting an error
                }
            });
        }
    
        fetchRoomsInfo() {        
            return fetch('/rooms',{method: 'GET', credentials: 'include'})
            .then(response => {            
                if (!response.ok){
                    throw response;
                }              
                return response.json();             
            });
        }

    handleAddRoom(e){
        e.preventDefault();
        let room = {
            name: e.target.elements.name.value,
            creator: this.props.userName,
            amountOfPlayers: parseInt(e.target.elements.amountOfPlayers.value)
        }
        return fetch('/rooms/addRoom',{method:'POST', body: JSON.stringify(room) ,credentials: 'include'})
        .then(response => {
            if(!response.ok){
                if (response.status === 403) {
                    this.setState(() => ({errMessage: "Room name already exist, please try another one"}));
                }
            }
            else{
                this.setState(() => ({showAddRoom: false, errMessage: ''}));
                this.getRooms();
            }
        })
    }

    handleRoomEntering(roomId){
        let user = {
            userName: this.props.userName,
            roomId: roomId
        };

        fetch('/rooms/enterRoom', {method:'POST',body: JSON.stringify(user) ,credentials: 'include'})
        .then(response => {
            if(!response.ok){
                
            }
            else{
                this.props.enteredRoomSuccessfully(roomId);
            }
        })

    }
    
    render(){

        let roomItems = null;
        if(this.state.showAddRoom === false){
            if(this.state.rooms !== null){
                roomItems = this.state.rooms.map((room) => {
                    return <Room key={room.Id}
                    data={room}
                    handleRoomEntering = {this.handleRoomEntering.bind(this)}
                    />
                });
            }

        return(
        <React.Fragment>
        <button onClick={() => this.setState(() => ({showAddRoom: true}))} className="add-room"> Add Room </button>
        <button onClick={this.props.logout} className="logout"> Logout </button>
        <div>
            {roomItems}
        </div>
        
        </React.Fragment>)
        }
        else{ //showAddRoom = true
            return(
            <div>
                <form onSubmit={this.handleAddRoom} className="form">
                    <label> name: </label>
                    <input name="name"/>  <br />
                    <label> number of players: </label> <br />
                    <input type="radio" name="amountOfPlayers" value="2" defaultChecked/> 2 <br />
                    <input type="radio" name="amountOfPlayers" value="3"/> 3 <br />
                    <input type="submit" value="Add" className ="btn-login"/>
                    <label className = "error-message">{this.state.errMessage}</label>
                </form>
            </div>
            )
        }
    }
}