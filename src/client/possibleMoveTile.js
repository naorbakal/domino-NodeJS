import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";

function PossibleMoveTile(props){
    const styleObj ={
        top: props.possibleMove.position.top.toString() +"%",
        left: props.possibleMove.position.left.toString() +"%"
  }

    return(
        <div 
        key = {props.possibleMove.position.top.toString() + props.possibleMove.position.left.toString()}
        className={"possibleMove " + props.possibleMove.angle}
        style ={styleObj}
        onClick={()=>{props.onClickHandler(props.possibleMove)}}
        >      
        </div>
    )
}

export default PossibleMoveTile;