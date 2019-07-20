import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from './signUp.js';
import Lobby from './lobby.js';
import GameIndex from '../gameApp/gameIndex.js';
import { type } from 'os';

export default class BaseContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: {
                name: props.name,
                location: props.location,
                roomId: null,
                inActiveGame: false
            }   
        };
        console.log(this.state.currentUser.location);
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler= this.logoutHandler.bind(this);
        this.handleExitRoom = this.handleExitRoom.bind(this);
        this.handleSuccessedRoomEntering= this.handleSuccessedRoomEntering.bind(this);
        this.gameStartedInterval;
        this.getUserData();
    }

    /*
    componentWillUnmount(){
        clearInterval(this.gameStartedInterval);
    }
    */

    componentDidUpdate(){
        return fetch('/users/updateUser',{method: 'POST', body:JSON.stringify(this.state.currentUser), credentials: 'include'})
        .then(response => {            
            if (!response.ok){
                throw response;
            }
        });
    }
    
    render() {        
        if (this.state.currentUser.location === "login") {
            return (<SignUp 
                loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError}/>)
        }

        else if(this.state.currentUser.location === "lobby")
        {
            return (<Lobby className ="lobby"
                 userName={this.state.currentUser.name}
                 enteredRoomSuccessfully={this.handleSuccessedRoomEntering}
                 logout={this.logoutHandler}/>)
        }
        else{
            return <GameIndex 
            gameStarted={this.state.currentUser.inActiveGame} 
            roomId = {this.state.currentUser.roomId}
            playerName={this.state.currentUser.name} 
            handleExitRoom = {this.handleExitRoom}/>
        }

    }


    handleSuccessedRoomEntering(roomId){  
        let user=this.state.currentUser;
        user.roomId=roomId;
        user.location="room";
        this.gameStartedInterval=setInterval(() =>{
                    fetch('/rooms/checkRoomFull',{method: 'POST',body:JSON.stringify({name: roomId}), credentials: 'include'})
                    .then(response => {
                        if (!response.ok){
                            throw response;
                        }  
                        else{
                            response.json().then((resBody)=>{
                                resBody=JSON.parse(resBody);
                                if (resBody.started === true){
                                    user.inActiveGame=true;
                                    clearInterval(this.gameStartedInterval);
                                    this.setState(()=>({currentUser:user}));
                                }      
                                })   
                        } 
             }); 
                }, 2000);
        this.setState(()=>({currentUser:user}));           
    }               
  
              
    handleSuccessedLogin(){
        this.getUserData();
    }

    handleLoginError() {
        console.error('login failed');
    }

    getUserData() {
        this.fetchUserInfo()
        .then(userInfo => {
            let user = JSON.parse(userInfo);
            this.setState(()=>({currentUser: user}));
        })
        .catch(err=>{            
            if (err.status !== 401) { // incase we're getting 'unautorithed' as response
                throw err; // in case we're getting an error
            }
        });
    }

    fetchUserInfo() {        
        return fetch('/users',{method: 'GET', credentials: 'include'})
        .then(response => {            
            if (!response.ok){
                throw response;
            }   
            return response.json();
            
        });
    }


    logoutHandler() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
        .then(response => {
            if (!response.ok) {
                console.log(`failed to logout user ${this.state.currentUser.name} `, response);                
            }
            else{
                let user = this.state.currentUser;
                user.name = '';
                user.location = "login";

                /*
                let user = {
                    name: '',
                    location: "login",
                    roomId: null
                }
                */
                this.setState(()=>({ currentUser : user }));
            }
        })
    }

    handleExitRoom(){
            fetch('/rooms/exitRoom',{method: 'POST',
            body:JSON.stringify({name: this.state.currentUser.roomId, 
                                playerToRemove: this.state.currentUser.name}),
                                 credentials: 'include'})
            .then(response => {
                if (!response.ok){
                    throw response;
                }  
                else{
                    /*
                    let user = {
                        location: "lobby",
                        roomId: null,
                        inActiveGame: false                       
                    };
                    */
                    this.setState(()=>({ currentUser:{ 
                        name: this.state.currentUser.name,
                        location: "lobby",
                        roomId: null,
                        inActiveGame: false    
                    } }));
            }
        })
    }
}