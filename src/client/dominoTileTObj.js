
class DominoTileObj{
    constructor(top, bottom){ 
        this.angle="vertical",
        this.selected =false;
        this.position={
            top:null,
            left:null
        }
        this.location="deck",
        this.values={
            top:top,
            bottom:bottom
        }
        this.endGame = false;
        this.isDouble = (this.values.top === this.values.bottom);   
    }
}

export default DominoTileObj;