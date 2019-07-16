import React from 'react';
import ReactDOM from 'react-dom';


class SignUp extends React.Component { 
    
    constructor(props){
        super(props);
        this.state ={
            errMessage: ""
        };
        this.handleLogin=this.handleLogin.bind(this);
    }
    
    render() {
        return (
            <div>
                <form onSubmit={this.handleLogin}  className= "form">
                    <label className ="login-text"> Login Domino Game </label>
                    <input name="userName"/>                        
                    <input type="submit" value="Login" className= "btn-login"/>
                    <label className = "error-message">{this.state.errMessage}</label>
                </form>
            </div>
        );
    }

    handleLogin(e) {
        e.preventDefault();
        const userName = e.target.elements.userName.value;
        fetch('/users/addUser', {method:'POST', body: userName, credentials: 'include'})
        .then(response=> {            
            if (response.ok){
                this.setState(()=> ({errMessage: ""}));
                this.props.loginSuccessHandler();
            } else {
                if (response.status === 403) {
                    this.setState(()=> ({errMessage: "User name already exist, please try another one"}));
                }
                this.props.loginErrorHandler();
            }
        });
        return false;

    }
}

export default SignUp;