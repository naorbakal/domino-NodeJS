import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";
import DominoTile from './dominoTile';


function Deck(props) {   
    let buttonClass;      
    if(props.endGame === true){
        buttonClass = " ";
    }
    else{
        buttonClass = "hidden";
    }
    return(
        <div className="panel deck"> 
            <div className="arrow-left" onClick={()=>props.prevOnClickHandler()}></div>          
            <button className="dominoTile " onClick= {props.onClick}>   
            </button> 
            <div className={buttonClass +" arrow-right"} onClick={()=>props.nextOnClickHandler()}></div>  
            <button className={buttonClass + " newGame"} onClick={()=>props.startNewGame()}>Start New Game</button>         
        </div>
    )
}    


export default Deck;