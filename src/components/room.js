import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from './signUp.js';
import { type } from 'os';


function Room(props){
    let roomStatus;
    let players = props.data.players.map(player => {return <h3 key={player}>{player} </h3>});
    let handleRoomEntering = (e)=>{
        e.preventDefault();
        props.handleRoomEntering(props.data.Id,false);
    }

    let handleObserverEntering = (e)=>{
        e.preventDefault();
        props.handleRoomEntering(props.data.Id,true);

    }

    if(props.data.started){
        roomStatus = <div>
        <p>Game Already Started</p>
        <button onClick={handleObserverEntering} className="enter-room-btn"> Watch Game </button>
        </div>

    }
    else{
        roomStatus = <div>
            <p>Waiting for players....</p>
            <button onClick={handleRoomEntering} className="enter-room-btn"> Enter Room </button>
            </div>
    }


    return(
        <div className="room">
        <p> name: {props.data.Id} </p> <br/>
        <p> number of players: {props.data.amountOfPlayers}</p> <br/>
        <p> creator: {props.data.creator} </p> <br/>
        <p> players:  </p>  <br/>
        {players} <br/>
        {roomStatus}
        </div>

    )

}

export default Room;