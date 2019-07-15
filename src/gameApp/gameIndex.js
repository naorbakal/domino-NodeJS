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
      return  <Wrapper />
     }
     else{
        return <h1>Waiting For Players</h1>
     }
 };

 export default GameIndex
