/* every game has two players, identified by their WebSocket */
var game = function(gameID) {
    this.playerWHITE = null;
    this.playerBLUE = null;
    this.id = gameID;
    this.wordToGuess = null; //first player to join the game, can set the word
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
      this.board = [//use array for board
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 0, 0, 0,
        0, 0, 0, 2, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0];

  };
  
  /*
   * The game can be in a number of different states.
   */
  game.prototype.transitionStates = {};
  game.prototype.transitionStates["0 JOINT"] = 0;
  game.prototype.transitionStates["1 JOINT"] = 1;
  game.prototype.transitionStates["2 JOINT"] = 2;
  game.prototype.transitionStates["WHITEPLAYED"] = 3;
  game.prototype.transitionStates["BLUEPLAYED"] = 4;
  game.prototype.transitionStates["WHITE"] = 5; //A won
  game.prototype.transitionStates["BLUE"] = 6; //B won
  game.prototype.transitionStates["ABORTED"] = 7;
  
  /*
   * Not all game states can be transformed into each other;
   * the matrix contains the valid transitions.
   * They are checked each time a state change is attempted.
   */
  game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 0], //0 JOINT
    [1, 0, 1, 0, 0, 0, 0, 0], //1 JOINT
    [0, 0, 0, 1, 0, 0, 0, 1], //2 JOINT (note: once we have two players, there is no way back!)
    [0, 0, 0, 0, 1, 1, 1, 1], //TURN PLAYER WHITE
    [0, 0, 0, 1, 0, 1, 1, 1], //TURN PLAYER BLUE
    [0, 0, 0, 0, 0, 0, 0, 0], //WHITE WON
    [0, 0, 0, 0, 0, 0, 0, 0], //BLUE WON
    [0, 0, 0, 0, 0, 0, 0, 0] //ABORTED
  ];

  game.prototype.setBoard = function(coordinate, color) {
    this.board[coordinate] = color;
  }

  game.prototype.getBoard = function() {
    return this.board;
  }
  
  game.prototype.isValidTransition = function(from, to) {
    console.assert(
      typeof from == "string",
      "%s: Expecting a string, got a %s",
      arguments.callee.name,
      typeof from
    );
    console.assert(
      typeof to == "string",
      "%s: Expecting a string, got a %s",
      arguments.callee.name,
      typeof to
    );
    console.assert(
      from in game.prototype.transitionStates == true,
      "%s: Expecting %s to be a valid transition state",
      arguments.callee.name,
      from
    );
    console.assert(
      to in game.prototype.transitionStates == true,
      "%s: Expecting %s to be a valid transition state",
      arguments.callee.name,
      to
    );
  
    let i, j;
    if (!(from in game.prototype.transitionStates)) {
      return false;
    } else {
      i = game.prototype.transitionStates[from];
    }
  
    if (!(to in game.prototype.transitionStates)) {
      return false;
    } else {
      j = game.prototype.transitionStates[to];
    }
  
    return game.prototype.transitionMatrix[i][j] > 0;
  };
  
  game.prototype.isValidState = function(s) {
    return s in game.prototype.transitionStates;
  };
  
  game.prototype.setStatus = function(w) {
    console.assert(
      typeof w == "string",
      "%s: Expecting a string, got a %s",
      arguments.callee.name,
      typeof w
    );
  
    if (
      game.prototype.isValidState(w) &&
      game.prototype.isValidTransition(this.gameState, w)
    ) {
      this.gameState = w;
      console.log("[STATUS] %s", this.gameState);
    } else {
      return new Error(
        "Impossible status change from %s to %s",
        this.gameState,
        w
      );
    }
  };
  
  game.prototype.hasTwoConnectedPlayers = function() {
    return this.gameState == "2 JOINT";
  };

  game.prototype.hasOnePlayerConnected = function() {
    return this.gameState == "1 JOINT";
  };

  
  game.prototype.isFinished = function() {
    return this.gameState == "WHITE" ||
            this.gameState == "BLUE" ||
            this.gameState == "ABORTED";
  };
  
  
  game.prototype.addPlayer = function(p) {
    console.assert(
      p instanceof Object,
      "%s: Expecting an object (WebSocket), got a %s",
      arguments.callee.name,
      typeof p
    );
  
    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
      return new Error(
        "Invalid call to addPlayer, current state is %s",
        this.gameState
      );
    }
  
    /*
     * revise the game state
     */
  
    var error = this.setStatus("1 JOINT");
    if (error instanceof Error) {
      this.setStatus("2 JOINT");
    }
  
    if (this.gameState == "1 JOINT") {
      this.playerWHITE = p;
      return "WHITE";
    } else {
      this.playerBLUE = p;
      return "BLUE";
    }
  };
  
  module.exports = game;