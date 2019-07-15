import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";

class Clock extends React.Component{

    constructor(props){
        super(props);
        this.state={minutes:{left:0,right:0},seconds:{left:0,right:0}};
        setInterval(()=>{this.moveClock()},1000);
    }

    componentWillReceiveProps(){
        if(this.props.init === true){
        let clockCopy = JSON.parse(JSON.stringify(this.state));
        clockCopy={minutes:{left:0,right:0},seconds:{left:0,right:0}};
        this.setState(clockCopy);
    }
    }

    moveClock(){

        let clockCopy = JSON.parse(JSON.stringify(this.state));

        if(this.props.pause === false){
    
            if(clockCopy.seconds.right < 9)
            {
                clockCopy.seconds.right++;
            }
            else{
                clockCopy.seconds.right=0;
                if(clockCopy.seconds.left < 5)
                {
                    clockCopy.seconds.left++;
                }
                
                else{
                    clockCopy.seconds.left = 0;
                    if(clockCopy.minutes.right < 9){
                        clockCopy.minutes.right++;
                    }
                    else{
                        clockCopy.minutes.right=0
                        clockCopy.minutes.left++;
                    }
                }
            }
            
        }
    else{
        clockCopy = {minutes:{left:0,right:0},seconds:{left:0,right:0}};
    }

    this.setState({minutes:{left:clockCopy.minutes.left,right:clockCopy.minutes.right},
        seconds:{left:clockCopy.seconds.left,right:clockCopy.seconds.right}});
 
}

    render(){
        let time = this.state.minutes.left.toString() + this.state.minutes.right.toString() +
                    ":" +
                    this.state.seconds.left.toString() + this.state.seconds.right.toString()
        return (
            <div className="clock">{time}</div>
        )
    }
}

export default Clock;