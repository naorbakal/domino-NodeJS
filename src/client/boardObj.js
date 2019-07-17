
class BoardObj{
        constructor(){
            this.height = 56;
            this.width = 56;
            this.matrix;// = this.createMatrix();
            this.possibleMoves = new Array();
            this.startPos = {
                angle: "horizontal270",
                top: 40,
                left :45
            }
            this.isEmpty = true;

            this.createMatrix();
    }

    createMatrix(){
        this.matrix = new Array(this.width);
        
        for(let i=0; i<this.width; i++){
            this.matrix[i] = new Array(this.height);
            for(let j=0; j<this.height; j++){
                this.matrix[i][j] = new Cell();       
            }
        }
    }
    getPossibleMoves(selectedTile){
        this.possibleMoves = new Array();
        let angle;
        for (var i=0;i<this.height;i++){    
            for (var j=0; j<this.width; j++){
                if(this.matrix[i][j].accessible === true && this.matrix[i][j].isOccupied === false){
                    if(selectedTile.values.top === this.matrix[i][j].possibleInserts.top){
                        angle = selectedTile.isDouble === true ? "horizontal90" : "vertical";
                        this.possibleMoves.push({angle: angle, col:j, row:i,
                             direction:"top" ,position:this.calculateOnBoardPosition(i,j,"top",selectedTile.isDouble)});                     
                    }
                    else if(selectedTile.values.bottom === this.matrix[i][j].possibleInserts.bottom){
                        angle = selectedTile.isDouble === true ? "horizontal90" : "vertical";
                        this.possibleMoves.push({angle: angle, col:j, row:i, direction: "bottom", position: this.calculateOnBoardPosition(i,j,"bottom",selectedTile.isDouble)});      
                    }
                    else if(selectedTile.values.top === this.matrix[i][j].possibleInserts.right){
                        angle = selectedTile.isDouble === true ? "vertical" : "horizontal90";
                        this.possibleMoves.push({angle: angle, col:j, row:i, direction:"right", position: this.calculateOnBoardPosition(i,j,"right",selectedTile.isDouble)});
                    }
                    else if(selectedTile.values.bottom === this.matrix[i][j].possibleInserts.left){
                        angle = selectedTile.isDouble === true ? "vertical" : "horizontal90";
                        this.possibleMoves.push({angle: angle, col:j, row:i, direction:"left", position: this.calculateOnBoardPosition(i,j,"left", selectedTile.isDouble)});
                    }
                    else if(selectedTile.values.top === this.matrix[i][j].possibleInserts.left){
                        angle = selectedTile.isDouble === true ? "vertical" : "horizontal270";                      
                            this.possibleMoves.push({angle: angle, col:j, row:i,direction: "left", position: this.calculateOnBoardPosition(i,j,"left", selectedTile.isDouble)});   
                    }
                    else if(selectedTile.values.bottom === this.matrix[i][j].possibleInserts.right){
                        angle = selectedTile.isDouble === true ? "vertical" : "horizontal270";
                        this.possibleMoves.push({angle: angle, col:j, row:i, direction: "right",position: this.calculateOnBoardPosition(i,j,"right", selectedTile.isDouble)});   
                    }

                    else if(selectedTile.values.top === this.matrix[i][j].possibleInserts.bottom){
                        angle = selectedTile.isDouble === true ? "horizontal90" : "upsideDown";
                        this.possibleMoves.push({angle: angle, col:j, row:i, direction:"bottom", position: this.calculateOnBoardPosition(i,j,"bottom",selectedTile.isDouble)});                       
                    }
                    else if(selectedTile.values.bottom === this.matrix[i][j].possibleInserts.top){
                        angle = selectedTile.isDouble === true ? "horizontal90" : "upsideDown";
                        this.possibleMoves.push({angle: angle, col:j, row:i, direction:"top", position: this.calculateOnBoardPosition(i,j,"top", selectedTile.isDouble)});                       
                    }
                
                }
            }
        }  
    }

    calculateOnBoardPosition(row,col,direction, isDouble){
        let top, left;
        if (direction === "top" &&
         (this.matrix[row-1][col].dominoTile.angle === "horizontal90" ||
         this.matrix[row-1][col].dominoTile.angle === "horizontal270")){
           
            top = this.matrix[row-1][col].dominoTile.position.top + 13;
            if(isDouble === false){
               
                left = this.matrix[row-1][col].dominoTile.position.left;
            }
            else{
                left = this.matrix[row-1][col].dominoTile.position.left - 2;
            } 
        }
        else if(direction === "bottom" && 
        (this.matrix[row+1][col].dominoTile.angle === "horizontal90" ||
        this.matrix[row+1][col].dominoTile.angle === "horizontal270")){
            top = this.matrix[row+1][col].dominoTile.position.top - 14;
            if(isDouble === false){
                left = this.matrix[row+1][col].dominoTile.position.left;
            }
            else{
                left = this.matrix[row+1][col].dominoTile.position.left - 2;
            }
        }
        else if(direction === "right" &&
        (this.matrix[row][col+1].dominoTile.angle === "horizontal90" ||
        this.matrix[row][col+1].dominoTile.angle === "horizontal270")){
            //good
            top = this.matrix[row][col+1].dominoTile.position.top;
            if(isDouble === false){
                left = this.matrix[row][col+1].dominoTile.position.left - 8;
            }
            else{
                left = this.matrix[row][col+1].dominoTile.position.left - 6;
            }
            
        }
        else if(direction === "left" &&
        (this.matrix[row][col-1].dominoTile.angle === "horizontal90" ||
        this.matrix[row][col-1].dominoTile.angle === "horizontal270")){
            // good
            top = this.matrix[row][col-1].dominoTile.position.top;
            if(isDouble === false){
                left = this.matrix[row][col-1].dominoTile.position.left + 8;
                
            }
            else{
                left = this.matrix[row][col-1].dominoTile.position.left + 6;
            }          
        
        }
        // vertical + upsideDown
        else if (direction === "top"){
            //good
            left = this.matrix[row-1][col].dominoTile.position.left;
            if(isDouble === false){              
                top = this.matrix[row-1][col].dominoTile.position.top + 17;               
            }
            else{
                top = this.matrix[row-1][col].dominoTile.position.top + 14;
            }
  
        }
        else if(direction === "bottom"){
            //good
            left = this.matrix[row+1][col].dominoTile.position.left;        
            if(isDouble === false){
                top = this.matrix[row+1][col].dominoTile.position.top - 17.5;
            }
            else{
                top = this.matrix[row+1][col].dominoTile.position.top - 16;
            }
        }
        else if(direction === "right"){
            left = this.matrix[row][col+1].dominoTile.position.left - 6;
            if(isDouble === false){
                top = this.matrix[row][col+1].dominoTile.position.top;
            }
            else{
                top = this.matrix[row][col+1].dominoTile.position.top + 10;
            }
            
        }
        else if (direction === "left"){ //left
            left = this.matrix[row][col-1].dominoTile.position.left + 6;
            if(isDouble === false){
                top = this.matrix[row][col-1].dominoTile.position.top;
            }
            else{
                top = this.matrix[row][col-1].dominoTile.position.top + 10;
            }          
        
        }

        return {top:top, left:left};
    }

    moveAllDown(){
        for (var i=0;i<this.height;i++){   
            for (var j=0; j<this.width; j++){
                if(this.matrix[i][j].isOccupied === true){
                    this.matrix[i][j].dominoTile.position.top += 20;
                }
            }
        }
    }

    moveAllRight(){
        for (var i=0;i<this.height;i++){    
            for (var j=0; j<this.width; j++){
                if(this.matrix[i][j].isOccupied === true){
                    this.matrix[i][j].dominoTile.position.left += 20;
                }
            }
        }
    }

    initBoard(){
        this.createMatrix();
        this.possibleMoves = new Array();
        this.isEmpty = true;
    }

    updateBoard(selectedTile, cell){

        if(selectedTile.angle === "vertical" || selectedTile.angle === "upsideDown"){
            if(selectedTile.angle === "vertical"){
                this.matrix[cell.row-1][cell.col].possibleInserts.bottom = selectedTile.values.top;
                this.matrix[cell.row+1][cell.col].possibleInserts.top = selectedTile.values.bottom;
            }
            else{ //upsideDown
                this.matrix[cell.row-1][cell.col].possibleInserts.bottom = selectedTile.values.bottom;
                this.matrix[cell.row+1][cell.col].possibleInserts.top = selectedTile.values.top;
            }
            //need to check if Occupied
            this.matrix[cell.row-1][cell.col].accessible = true;
            this.matrix[cell.row+1][cell.col].accessible = true;

            if(selectedTile.isDouble === true){
                this.matrix[cell.row][cell.col-1].possibleInserts.right = selectedTile.values.top;
                this.matrix[cell.row][cell.col+1].possibleInserts.left = selectedTile.values.bottom;
                this.matrix[cell.row][cell.col-1].accessible = true;
                this.matrix[cell.row][cell.col+1].accessible = true;
            }
        }
        else{ // horizontal90/270
            if(selectedTile.angle === "horizontal90"){
                this.matrix[cell.row][cell.col-1].possibleInserts.right = selectedTile.values.bottom;
                this.matrix[cell.row][cell.col+1].possibleInserts.left = selectedTile.values.top;
            }
            else{ //270
                this.matrix[cell.row][cell.col-1].possibleInserts.right = selectedTile.values.top;
                this.matrix[cell.row][cell.col+1].possibleInserts.left = selectedTile.values.bottom;
            }
            this.matrix[cell.row][cell.col-1].accessible = true;
            this.matrix[cell.row][cell.col+1].accessible = true;

            if(selectedTile.isDouble === true){
                this.matrix[cell.row-1][cell.col].possibleInserts.bottom = selectedTile.values.top;
                this.matrix[cell.row+1][cell.col].possibleInserts.top = selectedTile.values.bottom;
                this.matrix[cell.row-1][cell.col].accessible = true;
                this.matrix[cell.row+1][cell.col].accessible = true;
            }
        }

        this.matrix[cell.row][cell.col].dominoTile = selectedTile;
        this.matrix[cell.row][cell.col].isOccupied = true;
        this.matrix[cell.row][cell.col].accessible = false;
     }

}

class Cell{
    constructor(){
        this.isOccupied = false;
        this.accessible = false;
        this.possibleInserts = {
            left:null,
            right:null,
            top:null,
            bottom:null
        }
        this.dominoTile = null;
    }
}

export let boardObj = new BoardObj();