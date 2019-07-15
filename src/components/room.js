import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from './signUp.js';
import { type } from 'os';


function Room(props){
    let roomStatus;
    let players = props.data.players.map(player => {return <h3>{player} </h3>});
    let handleRoomEntering= (e)=>{
        e.preventDefault();
        props.handleRoomEntering(props.data.Id);
    }

    if(props.data.started){
        roomStatus = <p>Game Already Started</p>;
    }
    else{
        roomStatus = <div>
            <p>Waiting for players....</p>
            <button onClick={handleRoomEntering}> Enter Room</button>
            </div>
    }


    return(
        <div>
        <h3> name: {props.data.Id} </h3> <br/>
        <h3> number of players: {props.data.amountOfPlayers}</h3> <br/>
        <h3> creator: {props.data.creator} </h3> <br/>
        <h3> players:  </h3>  <br/>
        {players} <br/>
        {roomStatus}
        </div>

    )

}

export default Room;