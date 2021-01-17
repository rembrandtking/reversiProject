let clickSound = new Audio("../data/click.wav");

function GameState(visibleWordBoard, sb, socket) {
    this.playerType = null;
    this.pointsWhite = 0;
    this.pointsBlue = 0;
    this.statusBar = sb;
  
    this.initializeBoard = function () {
      this.visibleWordArray = new Array(this.targetWord.length);
      //this.visibleWordArray.fill(Setup.HIDDEN_CHAR);
    };
    
  this.getPlayerType = function () {
    return this.playerType;
  };

  this.setPlayerType = function (p) {
    this.playerType = p;
  };

  this.calculateScore = function () {
    // go through board and count pieces per player
    // check if someone won
  };

  this.whoWon = function () {
      //check if current this.validMovesArray == null
      //if true; player with most points is winner
      //if false; continue and return null
  };

  this.updateGame = function (coordinate) {
      //is x, y a valid position?
      //if not, return
      //if yes, update game and send to server

    //wrong guess

    this.visibleWordBoard.setWord(this.visibleWordArray);

    var outgoingMsg = Messages.O_MAKE_A_GUESS;
    outgoingMsg.data = coordinate;
    socket.send(JSON.stringify(outgoingMsg));

    //is the game complete?
    let winner = this.whoWon();
  };
}