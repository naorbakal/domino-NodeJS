import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";
import DominoTile from './dominoTile';
import Player from './player';


function Deck(props) {   
    let buttonClass; 
    let turnBanner;     

    let players = props.players.map(player => {
        return <h4 key={player}> {player} </h4>;
    });

    let observers = props.observers.map(observer => {
        return <h4 key={observer}> {observer} </h4>;
    });
    if(props.endGame === true){
        buttonClass = " ";
    }
    else{
        buttonClass = "hidden";
    }

    if(props.whosTurn !== ""){
        turnBanner=props.whosTurn+"'s " +"turn";
    }
    else{
        turnBanner="";
    }
    return(
        <div className="panel deck">
             <h4>{turnBanner}</h4>
             <p>Players: <br></br></p>
            <div>
            {players}
            </div>
            <p>Observers: <br></br></p>
            <div>
            {observers}
            </div>
            <button className="dominoTile " onClick= {props.onClick}>   
            </button> 
            <button className={buttonClass + " logout"} onClick={()=>props.quitGame()}>Quit Game</button>         
        </div>
    )
}    


export default Deck;