(function(exports) {
    /*
     * Client to server: game is complete, the winner is ...
     */
    exports.T_GAME_WON_BY = "GAME-WON-BY";
    exports.O_GAME_WON_BY = {
      type: exports.T_GAME_WON_BY,
      data: null
    };
  
    /*
     * Server to client: abort game (e.g. if second player exited the game)
     */
    exports.O_GAME_ABORTED = {
      type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);
  
    /*
     * Server to client: choose target word
     */
    exports.O_CHOOSE = { type: "CHOOSE-WORD" };
    exports.S_CHOOSE = JSON.stringify(exports.O_CHOOSE);
  
    /*
     * Server to client: set as player white (1)
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {
      type: exports.T_PLAYER_TYPE,
      data: "WHITE"
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);
  
    /*
     * Server to client: set as player blue (2)
     */
    exports.O_PLAYER_B = {
      type: exports.T_PLAYER_TYPE,
      data: "BLUE"
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);
  
    /*
     * Player A to server OR server to Player B, where did white place a piece?
     */
    exports.T_SET_WHITE = "SET-WHITE-PIECE";
    exports.O_SET_WHITE = {
      type: exports.T_SET_WHITE,
      data: null
    };
    //exports.S_TARGET_WORD does not exist, as we always need to fill the data property
  
    /*
     * Player B to server OR server to Player A: where did blue place a piece?
     */
    exports.T_SET_BLUE = "SET-BLUE-PIECE";
    exports.O_SET_BLUE = {
      type: exports.T_SET_BLUE,
      data: null
    };
    //exports.S_MAKE_A_GUESS does not exist, as data needs to be set
  
    /*
     * Server to Player A & B: game over with result won/loss
     */
    exports.T_GAME_OVER = "GAME-OVER";
    exports.O_GAME_OVER = {
      type: exports.T_GAME_OVER,
      data: null
    };
  })(typeof exports === "undefined" ? (this.Messages = {}) : exports);
  //if exports is undefined, we are on the client; else the server