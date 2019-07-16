import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";


/* Directly adding react element */
// ReactDOM.render(
//     React.createElement('div',null, 'hello world from react '), 
//     document.getElementById("root")
// );

const Header = () => {
    return (
    <header>       
        <h1>Domino</h1>
        <h3>Guy & Naor</h3>
    </header>
        );
    };

export default Header;