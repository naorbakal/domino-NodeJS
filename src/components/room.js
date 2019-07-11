import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from './signUp.js';
import { type } from 'os';


function Room(props){

    return(
        <h3> name: {props.data.Id} </h3>
    )

}

export default Room;