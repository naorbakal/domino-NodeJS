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
                name: '',
                location: "login",
                roomId: null,
                inActiveGame: false
            }           
        };
        
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler= this.logoutHandler.bind(this);
        this.handleSuccessedRoomEntering= this.handleSuccessedRoomEntering.bind(this);
        this.getUserData();
    }

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
            return (<SignUp loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError}/>)
        }

        else if(this.state.currentUser.location === "lobby")
        {
            return (<Lobby userName={this.state.currentUser.name}
                 enteredRoomSuccessfully={this.handleSuccessedRoomEntering}
                 logout={this.logoutHandler}/>)
        }
        else{
            return <GameIndex gameStarted={this.state.currentUser.inActiveGame}/>
        }

    }


    handleSuccessedRoomEntering(roomId){  
        let user=this.state.currentUser;
        user.roomId=roomId;
        user.location="room";
        let gameStartedInterval=setInterval(() =>{
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
                                    clearInterval(gameStartedInterval);
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
                let user = {
                    name: '',
                    location: "login",
                    roomId: null
                }     
                this.setState(()=>({ currentUser : user }));
            }
        })
    }
}