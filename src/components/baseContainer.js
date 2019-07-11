import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from './signUp.js';
import Lobby from './lobby.js';
import { type } from 'os';

export default class BaseContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: {
                name: '',
                location: "login",
                roomId: null,
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
            //return (<h1>{this.state.currentUser.name}</h1>)
        }
        else{
           return ( <h1>In room! {this.state.currentUser.roomId}</h1> )
        }
    }


    handleSuccessedRoomEntering(roomId){       
        this.setState(()=>({currentUser: {location: "room", roomId: roomId}}));
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
        console.log("check");
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
        .then(response => {
            console.log("check1");
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