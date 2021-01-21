//this script should know which moves are allowed
//it should store the state of the board
//it should update the board gfx

const AVAIL = 0; //unused box
const WHITE = 1; //box used by white
const BLUE = 2; //box used by blue


function BoardManager() {
  this.validMoves = undefined;
  this.board = undefined;

  this.resetValidMoves = function(){
    this.validMoves = [];
  }

  this.initialize = function() {//base board configuration
    this.board = [
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 1, 2, 0, 0, 0,
      0, 0, 0, 2, 1, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0];            
  };
  //0 = top left, 63 = bottom right

/*    board for checking winning
          this.board = [
            0, 2, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,];
            
  */


  this.textToColor = function(color){
    if(color == "WHITE") return 1;
    else if(color == "BLUE") return 2;
    else return color; //if neither, it might already be 1 or 2!
  };
  this.colorToText = function(color){
    if(color == 1) return "WHITE";
    else if(color == 2) return "BLUE";
    else return color; //if neither, it might already be 1 or 2!
  };

  this.placePiece = function(position, color, delay) {
    //console.log(position + " " + color); //logs where piece was placed and which color.
    //if(this.board[position] != 0) return; //return if not empty
    //clear valid moves if there are any
    if(this.validMoves != undefined && this.validMoves.length > 0){
      this.clearMoves();
    }

    this.board[position] = this.textToColor(color);
    setTimeout(this.updateVisualColor, delay, position, this.colorToText(color))
    
      //switch off the UI element by adding the 'disabled' class name (defined in game.css)    
  };

  this.updateVisualColor = function(position, color){
    document.getElementById(position).className =  "grid-item-" + color;
  }

  this.clearMoves = function(){
    for(let i = 0; i < this.validMoves.length; i++){
      document.getElementById(this.validMoves[i]).className =  "grid-item";
    }
    this.resetValidMoves();
  }

  //get count in board that match the id //1 for white, 2 for blue, 0 for unfilled
  this.getPieceCount = function(id){
    let count = 0;
    for(let i = 0; i < this.board.length; i++){
      if(this.board[i] == id) count++;
    }
    return count;
  };

  this.isValidMove = function(coordinate){
    if(this.validMoves == undefined) 
      return false;
    for(let i = 0; i < this.validMoves.length; i++){
      if(this.validMoves[i] == coordinate) return true;
    }
    return false;
  };
  
  //calculate valid moves for a specific color
  //color should be int 1 or 2
  this.determineValidMoves = function(color){
    color = this.textToColor(color);

    this.resetValidMoves();
    for(let i = 0; i < this.board.length; i++){
      if(this.board[i] != 0) continue; // skip all filled in slots

      if(this.validDirections(i, color, true).length > 0){//if this spot has at least one valid direction, this is a valid move
        this.validMoves.push(i); //add to list in this case.
        document.getElementById(i).className =  "grid-item-valid";//update UI
      }
    }
  };

  //returns list of valid directions you could traverse from one point to get the other points.
  //directions it return will be a single integer as given by getDirection function
  //color should be int 1 or 2, coordinate should be a single integer for array based board
  this.validDirections = function(coordinate, color, needOne) {
    color = this.textToColor(color);
    coordinate = +coordinate; //make sure that coordinate is a number
    let validDirectionsList = [];

    for(let x = -1; x <= 1; x++){
      for(let y = -1; y <= 1; y++){
        if(x == 0 && y == 0) continue;//we dont need this direction

        let position = coordinate; // already move once in the direction. the while loop assumes the current spot is the opposite color.
        let count = 0; //keep track of the enemy colors we have seen
        do{
          if(x > 0 && position % 8 == 7) //if going to the right, but this slot is the first in a row, break.
            break;
          if(x < 0 && position % 8 == 0) //if going to the left, but this slot is the last in a row, break.
            break;
          position += this.getDirection(x, y);

                    
          if(position > 63 || position < 0 || this.board[position] == 0) //if we find a gap, or exceed the board limitation break out of loop.
            break;

          if(this.board[position] != color) 
            count++;
          else if(count > 0){ //we found a spot with the same color as given argument, thus valid direction
            validDirectionsList.push(this.getDirection(x, y));
            if(needOne) return validDirectionsList; //if we only need to know IF this coordinate has a valid direction, we could return now to save time.
          }

        } while(this.board[position] != color && this.board[position] != 0);


      }
    }
    return validDirectionsList;
  };

  //get direction for array based map
  this.getDirection = function(x, y){
    return x + 8 * y;
  };
  this.leftOrRight = function(dir){
    if(dir == 1 || -7 || 9) return 1;
    if(dir == -1 || -9 || 7) return -1;
  }

  //change neighbouring pieces
  //color should be int 1 or 2, coordinate should be a single integer for array based board
  this.changePieces = function(coordinate, color) {
    let pieceAmount = 0;
    coordinate = +coordinate; //make sure coordinate is a number
    
    color = this.textToColor(color);
    let validDirs = this.validDirections(coordinate, color, false); //get list of valid directions

    for(let i = 0; i < validDirs.length; i++){
      position = coordinate + validDirs[i];

      while(this.board[position] != color && this.board[position] != 0){
        let delay = pieceAmount * 50;
        this.placePiece(position, color, delay);

        setTimeout(this.AnimatePiece, delay, position, color, this);

        position += validDirs[i];
        pieceAmount++;
        if(position > 63 || position < 0) break;
        if(this.leftOrRight(validDirs[i]) > 0 && position % 8 == 7) //if going to the right, but this slot is the first in a row, break.
          break;
        if(this.leftOrRight(validDirs[i]) < 0 && position % 8 == 0) //if going to the left, but this slot is the last in a row, break.
          break;
      }
    }    
  };

  this.AnimatePiece = function(position, color, obj){//set css animation tag
    let el = document.getElementById(position);
    el.style.animationName = color == 2 ? "WhiteToBlue" : "BlueToWhite";//get other animation    
  }
}