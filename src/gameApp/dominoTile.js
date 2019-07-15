import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";

/* Directly adding react element */
// ReactDOM.render(
//     React.createElement('div',null, 'hello world from react '), 
//     document.getElementById("root")
// );


class DominoTile extends React.Component {   

    constructor(props){
        super(props);
        this.classes = ["bcc135","tcc135","bbl23456","ttl456","bcl6","tcl6","btl456","tbl23456","btr23456","ttr23456","bcr6","tcr6","bbr456","tbr456"];
        this.style;
    }
    
    getBoardPosition(){
        if(this.props.tile.position.top != null){
            this.style ={
                top : this.props.tile.position.top.toString() + "%",
                left: this.props.tile.position.left.toString() + "%",
            }
        }
    }

    getClassNames(){
        let classNames = "dominoTile ";
        classNames += this.props.tile.selected;
        if(this.props.tile.endGame === true){
            classNames += " endGame"
        }
        return classNames + " " + this.props.tile.angle;
    }

    render(){
        this.getBoardPosition();
        let key = this.props.tile.values.top.toString() + this.props.tile.values.bottom.toString();
        let rgx = new RegExp ("^t.*" + this.props.tile.values.top);
        const topDots = this.classes.map((classString,index) => {
            
            if (classString.search(rgx) !== -1){
                return <span key={key + " top " +index} className= {classString}></span>
            }            
        });

        rgx = new RegExp ("^b.*" + this.props.tile.values.bottom);    
        const bottomDots = this.classes.map((classString,index) => {
             
            if (classString.search(rgx) !== -1){
                return <span key={key + " bottom " +index} className={classString} ></span>
            }
        }); 
  
        return (
            <div 
                className={this.getClassNames()}
                onClick={this.props.onClickHandler === null? null:()=>{this.props.onClickHandler(this.props.tile.values)}}
                style={this.style}
                >
                <span className="line" />
                {topDots}
                {bottomDots}
            </div>
        );
    }
}

export default DominoTile;