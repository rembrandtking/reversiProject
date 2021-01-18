//this script should know which moves are allowed
//it should store the state of the board
//it should update the board gfx

const AVAIL = 0; //unused box
const WHITE = 1; //box used by white
const BLUE = 2; //box used by blue
let validMovesArray = null;//have this array update at the start of each turn

function BoardManager() {
  this.board = undefined;

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
            
  };//0 = top left, 63 = bottom right

  this.placePiece = function(position, color) {
    console.log(position + " " + color);
    if(this.board[position] != 0) return; //return if not empty
    this.board[position] = (color == "WHITE" ? 1 : 2);
    document.getElementById(position).className += "-" + color;


      //switch off the UI element by adding the 'disabled' class name (defined in game.css)
      
    };

  //calculate valid moves
  this.validMoves = function() {
    validMovesArray = [[0, 0], [0, 1]]; //store the possible moves in matrix like this.
  };
  //is it a valid move?
  this.isValidMove = function(coordinate) {
      //is coordinate in function?
      return true;
  };

  //change neighbouring pieces
  this.changePieces = function(coordinate){
      //go through all 8 directions, on one way keep testing if piece is other color from original one, until there is either:
      //no piece, try again in another direction
      //a piece in the same color as the original.
      //in this case change all pieces to og color.
  };
}