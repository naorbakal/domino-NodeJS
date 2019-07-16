import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";
import Header from "./header.js";
import Game from "./game.js";
import background from "./gameBackground.jpg";
import { prependOnceListener } from 'cluster';

/* Directly adding react element */
// ReactDOM.render(
//     React.createElement('div',null, 'hello world from react '), 
//     document.getElementById("root")
// );

function Wrapper(props){
    return (
    <React.Fragment> 
       <Header />
        <Game roomId ={props.roomId}/>
    </React.Fragment>
    );
};

export default Wrapper;