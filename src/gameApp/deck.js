import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";
import DominoTile from './dominoTile';


function Deck(props) {   
    let buttonClass; 
    let turnBanner;     
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
            <div className="arrow-left" onClick={()=>props.prevOnClickHandler()}></div>          
            <button className="dominoTile " onClick= {props.onClick}>   
            </button> 
            <div className={buttonClass +" arrow-right"} onClick={()=>props.nextOnClickHandler()}></div>  
            <button className={buttonClass + " logout"} onClick={()=>props.quitGame()}>Quit Game</button>         
        </div>
    )
}    


export default Deck;