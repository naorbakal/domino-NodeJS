import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from './signUp.js';
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

        this.getUserData();
    }
    
    render() {        
        if (this.state.currentUser.location === "login") {
            return (<SignUp loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError}/>)
        }

        else{
            return (<h1>{this.state.currentUser.name}</h1>)
        }

    }


    handleSuccessedLogin(){
        //this.setState(()=>({showLogin:false}), this.getUserName);     

        this.getUserData();
        //console.log(this.state);  
    }

    handleLoginError() {
        console.error('login failed');
    }

    getUserData() {
        this.fetchUserInfo()
        .then(userInfo => {
            const user = JSON.parse(userInfo);
            //console.log("USERINFO " + typeof(userInfo));
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
                //console.log(response.json());
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
            this.setState(()=>{currentUser = response});
        })
    }
}