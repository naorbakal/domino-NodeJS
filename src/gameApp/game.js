import React from 'react';
import ReactDOM from 'react-dom';
import style from "./style.css";
import DominoTile from "./dominoTile";
import Deck from "./deck";
import Player from "./player";
import Board from './board';
import Statistics from './statistics';
import DominoTileObj from "./dominoTileTObj";
import {boardObj} from "./boardObj";
import Clock from './clock';
import { type } from 'os';
import BaseContainer from '../components/baseContainer';
import PulledFromDeck from "./pulledFromDeck.js";


class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={ 
                    pulledDomino:null,
                    quitGame:false,
                    allPlayersFinished:false,
                    roomId: props.roomId,
                    name:props.name,
                    whosTurn:"",
                    dominoTiles: new Array(),
                    playerTiles: new Array(),
                    boardTiles: new Array(),
                    board: this.deepCopy(boardObj.matrix),
                    statistics:{
                        turnsSoFar:0,
                        averagePlayTime:0,
                        withdrawals:0,
                        score:0
                    },
                    players: new Array(),
                };
        this.needDraw = false;
        this.gameStartingTime;
        this.endGame = false;
        this.newGame = true;
        this.firstPlayer=false;
        this.performUpdate=false;
        this.boardUpdateObj=null;
        this.pulledFromDeckObj=null;
        this.winnersArr = new Array();
        this.outOfPlaysArr = new Array();
        this.handleExitRoom = this.props.handleExitRoom;
        this.players = new Array();
        this.observers = new Array();
        this.checkBoardChangesInterval;
        this.myTurn1;
        this.myTurn2;
        this.getGameObservers = this.getGameObservers.bind(this);
        this.observersInterval=setInterval(()=>{
            this.getGameObservers();
        },2000);

        this.getGamePlayers();
        this.getGameObservers();


    }



    getGamePlayers(){
        fetch('/games/getGamePlayers', {method:'POST', body:JSON.stringify({roomId:this.props.roomId}), credentials: 'include'})
        .then((res)=>{
            res.json().then(resJson =>{
                this.players = resJson.players;
            })
        })
    }

    getGameObservers(){
        fetch('/games/getObservers', {method:'POST', body:JSON.stringify({roomId:this.props.roomId}), credentials: 'include'})
        .then((res)=>{
            res.json().then(resJson =>{
                this.observers = resJson.observers;
            })
        })
    }


    getUsers() {
        this.fetchUsersInfo()
        .then(users => {
            let usersArr = JSON.parse(users);
            this.setState(()=>({users: usersArr}));
        })
        .catch(err=>{            
            if (err.status !== 401) { // incase we're getting 'unautorithed' as response
                throw err;
                 // in case we're getting an error
            }
        });
    }


    componentWillUnmount(){
        clearInterval(this.checkBoardChangesInterval);
        clearInterval(this.myTurn1);
        clearInterval(this.myTurn2);
        clearInterval(this.roomPlayers);
        clearInterval(this.observersInterval);
    }

    componentDidMount(){
        if(this.props.observer === false){

        fetch('/games/startGame', {method:'POST', body:JSON.stringify({roomId:this.props.roomId}), credentials: 'include'})
        .then((res)=>{
            fetch('/games/firstPlayer', {method:'POST', body:JSON.stringify({roomId:this.props.roomId}), credentials: 'include'})
            .then(response =>{
                response.json().then(resJson =>{
                    if(resJson.firstPlayer === this.props.name){
                        this.firstPlayer = true;
                    }
                })
                .then(()=>{
                    if(this.firstPlayer===true){
                        this.startNewGame();
                    }
                    else{
                        this.myTurn1=setInterval(()=>{
                            fetch('/games/whosTurn', {method:'POST', body:JSON.stringify({roomId:this.props.roomId}), credentials: 'include'})
                            .then(response =>{
                                response.json().then(resJson =>{
                                    if(resJson.player.player === this.props.name){
                                        fetch('/games/getGameData', {method:'POST', body:JSON.stringify({roomId:this.props.roomId}), credentials: 'include'})
                                        .then(response => {
                                            response.json().then(resJson =>{
                                                this.startNewGame(resJson.dominoTiles);
                                            })
                                        });
                                        clearInterval(this.myTurn1);
                                    }
                                })     
                            }); 
                        },2000);
                    }
                });     
            })
            
        })
    }

    else{
        this.newGame=false;
        this.checkBoardChanges()
    }
     
}

    componentDidUpdate(){
        if(this.props.observer ===false){
            this.update();
        }
    }

    update(){
        this.needDraw = this.checkIfNeedDraw();
        if(this.performUpdate===true){
            fetch('/games/updateGame', {method:'POST', body: JSON.stringify({player:this.props.name,pulledFromDeckObj:this.pulledFromDeckObj,statistics:this.state.statistics,roomId:this.props.roomId,boardTiles:this.boardUpdateObj,dominoTiles:this.state.dominoTiles}), credentials: 'include'})
            .then(()=>{
                this.pulledFromDeckObj=null;
                this.waitYourTurn();  
            })
            this.performUpdate=false;                   
        }
    }

    waitYourTurn(){
        this.myTurn2 = setInterval(()=>{
            fetch('/games/whosTurn', {method:'POST', body:JSON.stringify({roomId:this.props.roomId}), credentials: 'include'})
            .then(response =>{
                response.json().then(resJson =>{
                    let pulledDomino = resJson.pulledFromDeckObj;
                    if(resJson.endGame===true){
                        this.winnersArr = resJson.winners;
                        this.outOfPlaysArr = resJson.outOfPlays;  
                        this.setState({allPlayersFinished:true}); 
                        clearInterval(this.myTurn2);

                    }
                    else{
                        if(resJson.player.player === this.props.name){
                            fetch('/games/getGameData', {method:'POST', body:JSON.stringify({roomId:this.props.roomId}), credentials: 'include'})
                            .then(response => {
                                response.json().then(resJson =>{
                                    if(resJson.boardTiles!==null){
                                        if(resJson.boardTiles.movedAllDown === true){
                                            boardObj.moveAllDown();
                                            resJson.boardTiles.movedAllDown=false;
                                        }
                                        if(resJson.boardTiles.movedAllRight === true){
                                            boardObj.moveAllRight();
                                            resJson.boardTiles.movedAllRight=false;
                                        }

                                        boardObj.updateBoard(resJson.boardTiles.selectedTile,resJson.boardTiles.position);
                                        this.boardUpdateObj=resJson.boardTiles;
                                        this.setState({
                                        boardTiles:resJson.boardTiles.boardTiles,
                                        board: this.deepCopy(boardObj.matrix),
                                        dominoTiles:resJson.dominoTiles,
                                        whosTurn:this.props.name,
                                        pulledDomino:pulledDomino
                                      });
                                    }
                                    else{
                                        this.setState({whosTurn:this.props.name,
                                                     dominoTiles:resJson.dominoTiles,
                                                     pulledDomino:pulledDomino
                                                    });
                                    }  
                                })
                            });
                            clearInterval(this.myTurn2);
                        }
                        else{
                            
                            this.setState({whosTurn:boardObj.isEmpty === true ? this.props.name:resJson.player.player,
                                pulledDomino:pulledDomino
                            });
                            if(resJson.boardTiles!==null){
                                boardObj.updateBoard(resJson.boardTiles.selectedTile,resJson.boardTiles.position);
                                this.setState({whosTurn:resJson.player.player,
                                                boardTiles:resJson.boardTiles.boardTiles,
                                                pulledDomino:pulledDomino
                                            });
                            }
                            
                        }
                    }

                })     
            }); 
        },2000);
    }

    checkIfPlayerWinOrLoose(game){
        let allPlayersFinished=false
        if(game.playerTiles.length === 0){
            this.endGame = true;
            this.performUpdate=true;
            this.setState({whosTurn:""});
            fetch('/games/setWinner', {method:'POST', body:JSON.stringify({roomId:this.props.roomId,name: this.props.name,statistics:game.statistics}), credentials: 'include'})
            .then((res)=>{
                res.json().then((resJson)=>{
                    if(resJson.winnerNumber === 1){
                        alert("You came in first place");    
                    }
                    else if(resJson.winnerNumber === 2){
                        alert("You came in second place"); 
                    }

                    if(resJson.endGame===true){
                        allPlayersFinished=true;
                    }
                    if(allPlayersFinished === true){
                        this.setState({allPlayersFinished:true});
                    }
                    
                else {
                     this.checkBoardChanges()
                }
            })
        })
    }
        else{
            this.performUpdate=true;
            let deck = game.dominoTiles.filter((tile)=>{return this.checkTileLocation(tile,"deck")});
            if(deck.length === 0 && this.needDraw === true){
                fetch('/games/outOfPlays', {method:'POST', body:JSON.stringify({roomId:this.props.roomId,player:this.props.name,statistics:game.statistics}), credentials: 'include'})
                alert("You have no moves");
                this.update();
            }
        }

    }

    checkBoardChanges(){
        this.checkBoardChangesInterval=setInterval(()=>{
            fetch('/games/checkBoardUpdate', {method:'POST', body:JSON.stringify({roomId:this.props.roomId}), credentials: 'include'})
            .then((res)=>{
                res.json().then((resJson)=>{
                    if(resJson.boardTiles!==null){
                        this.setState({boardTiles:resJson.boardTiles.boardTiles});
                        if(resJson.endGame===true){
                            this.winnersArr = resJson.winners;
                            this.outOfPlaysArr = resJson.outOfPlays; 
                            this.setState({allPlayersFinished:true});
                            clearInterval(this.checkBoardChangesInterval);
                        }
                    }
                });
            });
        },2000);
    }
    startNewGame(i_dominoTiles=null){
        let dominoTiles =  i_dominoTiles;
        boardObj.initBoard();
        if(i_dominoTiles === null){
            dominoTiles = this.createTiles();
        }
        let playerTiles = this.chooseStartingTiles(dominoTiles);
        this.needDraw = false;
        this.gameStartingTime = Date.now();
        let score = this.getPlayerScore(playerTiles);
        this.endGame = false;
        this.newGame = false;
        
        if(this.firstPlayer===false){
            boardObj.isEmpty = false
        }
        this.performUpdate=true;
        this.setState({dominoTiles: dominoTiles,
                       playerTiles: playerTiles,
                       board: this.deepCopy(boardObj.matrix),
                       statistics:{
                        turnsSoFar: 0,
                        averagePlayTime: 0,
                        withdrawals: 0,
                        score : score},
        });
    }

    getPlayerScore(playerTiles){
        let score = 0;

        for(let i=0; i<playerTiles.length; i++){
            score += playerTiles[i].values.top + playerTiles[i].values.bottom;
        }
        return score;
    }

    checkTileLocation(tile,location){
        if(tile.location === location){
            return tile;
        }
    }

    deepCopy(obj){
        return JSON.parse(JSON.stringify(obj));
     }

    createTiles(){
        let tempDominoTilesArr = new Array();

        for(let i=0; i<=6; i++){
            for(let j=i; j<=6; j++){
                tempDominoTilesArr.push(new DominoTileObj(i,j)); 
            }
        }
        return tempDominoTilesArr;
    }

     chooseRandomTile(dominoTiles){
        let index;
        let deck = new Array();
        deck = dominoTiles.filter((tile) => {return this.checkTileLocation(tile,"deck")});
        if(deck.length === 0){
            alert("deck is empty");
        }
        else{
        index = Math.floor(Math.random() * deck.length);
        deck[index].location = this.props.name;

        return deck[index]; 
        }
    }
     

    chooseStartingTiles(dominoTiles){
        for(var i=0; i<6 ;i++){
            this.chooseRandomTile(dominoTiles);
        }

        let playerTiles = dominoTiles.filter((tile)=>{return this.checkTileLocation(tile,this.props.name)});
        return playerTiles;
    }
    
    updateStatistics(game,updateWithdrawal = false ){
        if(updateWithdrawal === true){
            game.statistics.withdrawals++;
        }
        game.statistics.turnsSoFar++;
        game.statistics.score = this.getPlayerScore(game.playerTiles);
        game.statistics.averagePlayTime =  (((Date.now()- this.gameStartingTime)/1000) / game.statistics.turnsSoFar).toFixed(2);
    }
    pullFromDeck(){
        if(this.needDraw === true){
            let game = this.deepCopy(this.state);
            let newTile = this.chooseRandomTile(game.dominoTiles);
            this.pulledFromDeckObj=newTile;
            game.playerTiles.push(newTile);
            this.updateStatistics(game,true);
            this.checkIfPlayerWinOrLoose(game);

            this.performUpdate=true;
            this.setState(game);
        }
        else{
            alert("you can play");
        }
    }

    getPlayerScore(playerTiles){
        let score = 0;
        for(let i=0; i<playerTiles.length; i++){
            score += playerTiles[i].values.top + 
                playerTiles[i].values.bottom;
        }
        return score;
    }

    dominoTileOnClickHandler(selectedTileValues){
        if(this.endGame === false){
        let game = this.deepCopy(this.state);
        let selectedTile = this.findTile(game,selectedTileValues);
        if(boardObj.isEmpty === true){
            this.performUpdate=true;
            this.firstTurn(game, selectedTile);
            boardObj.isEmpty = false;
        }
        else{
            boardObj.getPossibleMoves(selectedTile);
            if(boardObj.possibleMoves.length === 0){
                this.highlightDomino(game, selectedTileValues ,"redHighlight"); 

            }
            else{
                this.highlightDomino(game, selectedTileValues, "greenHighlight"); 
            }
        }   
        this.setState(game);
    }
        
    }

    checkIfNeedDraw(){
        let needDraw = true;
        if(boardObj.isEmpty){
            needDraw = false;
        }
        else{ 
        for(let i=0; i<this.state.playerTiles.length; i++){
                boardObj.getPossibleMoves(this.state.playerTiles[i]);
                if(boardObj.possibleMoves.length > 0){
                    needDraw = false;
                    break;
                }
            }
        }
        boardObj.possibleMoves.length = 0;
        return needDraw;
    }
    

    possibleMoveClickHandler(selectedPossibleMove){
        let game = this.deepCopy(this.state);
        let selectedTile = this.findSelectedTile(game);
        let movedAllRight=false;
        let movedAllDown=false

        if(selectedPossibleMove.position.top < 8){
            selectedPossibleMove.position.top +=20;
            boardObj.moveAllDown();
            game.boardTiles.forEach((boardTile) => {
                boardTile.position.top += 20;
            });
            movedAllDown=true;
        }
        if(selectedPossibleMove.position.left < 8){
            selectedPossibleMove.position.left +=20;
            boardObj.moveAllRight();
            game.boardTiles.forEach((boardTile) => {
                boardTile.position.left += 20;
            });
            movedAllRight=true;
        }
        boardObj.possibleMoves.length=0;
        selectedTile.selected = false;
        selectedTile.position.top = selectedPossibleMove.position.top;
        selectedTile.position.left = selectedPossibleMove.position.left;
        selectedTile.angle = selectedPossibleMove.angle;
        selectedTile.location = "board";
        game.playerTiles = game.playerTiles.filter((tile)=>{return this.checkTileLocation(tile,this.props.name)});
        boardObj.updateBoard(selectedTile,{row: selectedPossibleMove.row,col: selectedPossibleMove.col});
        game.boardTiles.push(selectedTile);
        this.boardUpdateObj={boardTiles:game.boardTiles,selectedTile:selectedTile,position:{row: selectedPossibleMove.row,col: selectedPossibleMove.col},
        movedAllDown:movedAllDown,movedAllRight:movedAllRight};
        game.board = boardObj.matrix;
        this.updateStatistics(game);
        
        this.checkIfPlayerWinOrLoose(game);
       
        if(game.playerTiles.length === 0){
            for(let i=0; i<game.boardTiles.length; i++){
                game.boardTiles[i].endGame = true;
            }
        }
        this.performUpdate=true;
        this.setState(game);
    }

    updateDominoTiles(selectedTile,game){
        game.dominoTiles.forEach(element => {
            if(element.values.top === selectedTile.values.top &&
               element.values.bottom === selectedTile.values.bottom){             
                element=selectedTile;
            }
            });
        }   

    findSelectedTile(game){
        let res;
        game.playerTiles.forEach(element => {
            if(element.selected !== ""){
                res = element;
            }
            });

            return res;
        }

    findTile(game,dominoValues){
        let res;
        game.playerTiles.forEach(element => {
            if(element.values.top === dominoValues.top &&
               element.values.bottom === dominoValues.bottom){             
                res = element;
            }
            });

            return res;
        }
    

    firstTurn(game, selectedTile){
        game.boardTiles = new Array();
        let boardPosition = {row:28, col:28, tile:selectedTile};
        selectedTile.position.top = boardObj.startPos.top;
        selectedTile.position.left = boardObj.startPos.left;
        selectedTile.angle = boardObj.startPos.angle;
        selectedTile.location = "board";
        game.boardTiles.push(selectedTile);
        game.playerTiles = game.playerTiles.filter((tile)=>{return this.checkTileLocation(tile,this.props.name)});  
        boardObj.updateBoard(selectedTile,boardPosition);
        this.boardUpdateObj={boardTiles:game.boardTiles,selectedTile:selectedTile,position:{row: boardPosition.row,col: boardPosition.col},
        movedAllDown:false,movedAllRight:false};
        game.board = boardObj.matrix;
        this.updateStatistics(game);   
    }

    highlightDomino(game, selectedDominoTile, highlightColor){
        game.playerTiles.forEach(element => {
            if(element.values.top === selectedDominoTile.top &&
               element.values.bottom === selectedDominoTile.bottom){
                element.selected = highlightColor;
            }
            else{
                element.selected = "";
            }            
        });
    }
        

    getEndGameStatItems(){
        let res = new Array();
        let place = 1;
        for(var i=0; i<this.winnersArr.length; i++){
            //res.push({name: this.winnersArr.player ,statistics: this.winnersArr.statistics});
            res.push(
            <div key={this.winnersArr[i].name}>
            <h2> In The {place} Place</h2>
            <h3> Name: {this.winnersArr[i].name} </h3>
            <h3> Total turns: {this.winnersArr[i].statistics.turnsSoFar}</h3>
            <h3> Average Play Time: {this.winnersArr[i].statistics.averagePlayTime} </h3>
            <h3> Withdrawals: {this.winnersArr[i].statistics.withdrawals} </h3>
            <h3> Score: {this.winnersArr[i].statistics.score} </h3> 
            </div>
            );
            place++;
        }
        for(var i=0; i<this.outOfPlaysArr.length; i++){
            res.push(
                <div key={this.outOfPlaysArr[i].player}>
                <h2> In The {place} Place</h2>
                <h3> Name: {this.outOfPlaysArr[i].player} </h3>
                <h3> Total turns: {this.outOfPlaysArr[i].statistics.turnsSoFar}</h3>
                <h3> Average Play Time: {this.outOfPlaysArr[i].statistics.averagePlayTime} 
                </h3>
                <h3> Withdrawals: {this.outOfPlaysArr[i].statistics.withdrawals} </h3>
                <h3> Score: {this.outOfPlaysArr[i].statistics.score} </h3> 
                </div>
            );
            place++;
        }
        return res;
    }
    
    quitGame(){
        this.handleExitRoom();
    } 
    
    
    quitGameAndRemove(){
        fetch('/games/deleteGame', {method:'DELETE', body:JSON.stringify({roomId:this.state.roomId}), credentials: 'include'})
        .then(response=> {            
            if (!response.ok){
                throw response;
            }}); 

        fetch('/rooms/deleteRoom', {method:'DELETE', body:JSON.stringify({roomId:this.state.roomId}), credentials: 'include'})
        .then(response=> {            
            if (!response.ok){
                throw response;
            }
            else{
                this.quitGame();              
            }
        })    
    }
    
    render(){
        if(this.state.allPlayersFinished===false){
            return (
                <div className="game">
                    <div className="firstRow">
                        <Deck quitGame={this.quitGame.bind(this)} 
                         onClick={this.state.whosTurn === this.props.name ? () => {this.pullFromDeck();}:()=>{ alert("Not your Turn");}}
                         whosTurn={this.state.whosTurn}
                         players={this.players}
                         observers={this.observers}
                         myTurn={this.state.whosTurn === this.props.name ? true:false}
                         endGame={this.endGame || this.props.observer}/>
                        <Board  boardTiles={this.state.boardTiles} 
                            possibleMoves={boardObj.possibleMoves} 
                            possibleMoveOnClickHandler = {this.possibleMoveClickHandler.bind(this)}/>
                        <Statistics statistics = {this.state.statistics} initClock={this.newGame} pauseClock ={this.endGame}/>
                        </div> 
                    <div className="secondRow">
                    <Player playerTiles={this.state.playerTiles} 
                        dominoTileOnClickHandler={this.state.whosTurn === this.props.name ?this.dominoTileOnClickHandler.bind(this):
                        ()=>{ alert("Not your turn");} } 
                                          />
                    <PulledFromDeck
                        tile={this.state.pulledDomino}
                    />                      
                    </div>    
                </div>
            )
        }
        else{
            let endGameStatItems = this.getEndGameStatItems();

            return( 
                <div className="form">
                {endGameStatItems}
                <button onClick={this.quitGameAndRemove.bind(this)} className="logout">
                 Quit
                </button>
                </div>
            )
        }
    }
}

export default Game;