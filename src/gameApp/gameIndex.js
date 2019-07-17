import React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from './wrapper.js';
import background from "./gameBackground.jpg";

/* Directly adding react element */
// ReactDOM.render(
//     React.createElement('div',null, 'hello world from react '), 
//     document.getElementById("root")
// );

 function GameIndex(props){
     if(props.gameStarted === true){
      return  <Wrapper roomId = {props.roomId} playerName={props.playerName}/>
     }
     else{
        return( 
        <React.Fragment>
        <div className = "form">
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        <h1>Waiting For Players</h1>

        <button onClick={props.handleExitRoom} className="exit-room"> Exit Room </button>
        </div>
        </React.Fragment>
        )
     }
 };

 export default GameIndex
