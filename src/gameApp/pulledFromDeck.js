import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";
import DominoTile from "./dominoTile";

function PulledFromDeck(props){
   
    if(props.tile!==null){
        return (
        <DominoTile
        key={props.tile.values.top.toString() + props.tile.values.bottom.toString()}
        selected={props.tile.selected}
        tile={props.tile}
       />)
    }
    else
    return (null);
}
export default PulledFromDeck;  