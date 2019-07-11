import React from 'react';
import Room from './room.js';
import ReactDOM from 'react-dom';



export default class Lobby extends React.Component{
    constructor(props){
        super(props);
        //console.log(props);
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
                console.log(roomsInfo);
                if(roomsInfo.length !== 0){
                let roomsArr = JSON.parse(roomsInfo);
                console.log(roomsArr);
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
            amountOfPlayers: e.target.elements.amountOfPlayers.value
        }
        return fetch('/rooms/addRoom',{method:'POST', body: JSON.stringify(room) ,credentials: 'include'})
        .then(response => {
            if(!response.ok){
                if (response.status === 403) {
                    this.setState(() => ({errMessage: "User name already exist, please try another one"}));
                }
            }
            else{
                this.setState(() => ({showAddRoom: false, errMessage: ''}));
                this.getRooms();
            }
        })
    }
    
    render(){

        let roomItems = null;
        if(this.state.showAddRoom === false){
            if(this.state.rooms !== null){
                roomItems = this.state.rooms.map((room) => {
                    return <Room
                    data={room}
                    />
                });
            }

        return(
        <React.Fragment>
        <button onClick={() => this.setState(() => ({showAddRoom: true}))}>  Add Room </button>
        <div>
            {roomItems}
        </div>
        
        </React.Fragment>)
        }
        else{ //showAddRoom = true
            return(
            <div>
                <form onSubmit={this.handleAddRoom}>
                    <label> name: </label>
                    <input name="name"/>  <br />
                    <label> number of players: </label> <br />
                    <input type="radio" name="amountOfPlayers" value="2" defaultChecked/> 2 <br />
                    <input type="radio" name="amountOfPlayers" value="3"/> 3 <br />
                    <input type="submit" value="add"/>
                    <label>{this.state.errMessage}</label>
                </form>
            </div>
            )
        }
    }
}