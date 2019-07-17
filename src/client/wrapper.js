import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";
import Header from "./header.js";
import Game from "./game.js";
import background from "./gameBackground.jpg";

/* Directly adding react element */
// ReactDOM.render(
//     React.createElement('div',null, 'hello world from react '), 
//     document.getElementById("root")
// );


const Wrapper = () => {
    return (
    <React.Fragment> 
       <Header />
        <Game />
    </React.Fragment>
        );
    };

export default Wrapper;