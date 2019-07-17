import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";
import Clock from "./clock.js";

function Statistics (props){
        return(
        <div className="panel stat">
            <Clock init={props.initClock} pause={props.pauseClock} />            
            <div className="statLabel"> Turns So Far
                <p>{props.statistics.turnsSoFar}</p>
            </div>    
            <div className="statLabel">Average Play Time
                <p>{props.statistics.averagePlayTime}</p>
            </div>    
            <div className="statLabel">Withdrawals
                <p>{props.statistics.withdrawals}</p>
            </div>
            <div className="statLabel">Score
                <p>{props.statistics.score}</p>
            </div>

        </div>
        );
    }
export default Statistics;