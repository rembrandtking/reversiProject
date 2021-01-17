let soundWhite = new Audio("../data/c.mp3");
let soundBlue = new Audio("../data/g.mp3");

function GameState(visibleWordBoard, sb, socket) {
    this.playerType = null;
    this.pointsWhite = 0;
    this.pointsBlue = 0;
    this.statusBar = sb;
    this.boardManager = new BoardManager();
    this.boardManager.initialize();
    
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

  //update the game, do this BEFORE the new player gets to make a move
  this.updateGame = function (clickedBox, color) {

    //the clickedPiece number can be assumed to be a valid move, this should have been checked on other client
    //so we only need to update all required pieces
    //we then get the new score for both players.

    //we now make this player move

    this.boardManager.placePiece(clickedBox, color);
    if(color == "WHITE"){
      soundWhite.play();
    }
    else{
      soundBlue.play();
    }
    //clickSound.play();

    //if the current player didnt place this part, no need to resend messages.
    if(this.playerType != color) return;


    //disable movement on current player
    canInteract(false);


    
    if(this.playerType == "WHITE"){
      sb.setStatus(Status["player1Wait"]);
      var outgoingMsg = Messages.O_SET_WHITE;
      outgoingMsg.data = clickedBox;
      socket.send(JSON.stringify(outgoingMsg));
    }
    else{
      sb.setStatus(Status["player2Wait"]);
      var outgoingMsg = Messages.O_SET_BLUE;
      outgoingMsg.data = clickedBox;
      socket.send(JSON.stringify(outgoingMsg));
    }

    let winner = this.whoWon();

    if (winner != null) {

      /* disable further clicks by cloning each alphabet
       * letter and not adding an event listener; then
       * replace the original node through some DOM logic
       */


      let alertString;
      if (winner == this.playerType) {
        alertString = Status["gameWon"];
      } else {
        alertString = Status["gameLost"];
      }
      alertString += Status["playAgain"];
      sb.setStatus(alertString);
      //send message to other player.
      socket.close();
    }
  };
}

  function BoardSetup(gs) {
    //only initialize for player that should actually be able to use the board
    this.initialize = function () {
      var elements = document.querySelectorAll(".grid-box");
      Array.from(elements).forEach(function (el) {
        el.addEventListener("click", function singleClick(e) {          
            var clickedBox = e.target.id;
            if(!gs.boardManager.isValidMove(clickedBox)) {
              //say its not valid
              return;
            }
            gs.updateGame(clickedBox, gs.playerType);

            //if not your turn, print in status bar
            //if it is, check if valid
  
          /*
           * every letter can only be selected once; handling this within
           * JS is one option, here simply remove the event listener when a click happened
           */
          el.removeEventListener("click", singleClick, false);
        });
      });
    };
  }

  function canInteract(boolean){
    let elements = document.querySelectorAll(".grid-box");
    Array.from(elements).forEach(function (el) {
      el.style.pointerEvents = (boolean ? "auto" : "none");
    });
  }

  (function setup() {
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);  
    /*
     * initialize all UI elements of the game:
     * - visible word board (i.e. place where the hidden/unhidden word is shown)
     * - status bar
     * - alphabet board
     *
     * the GameState object coordinates everything
     */
  
    var vw = new VisibleWordBoard();
    var sb = new StatusBar();
  
    //no object, just a function
  
    var gs = new GameState(vw, sb, socket);
    var ab = new BoardSetup(gs);
    ab.initialize();
    canInteract(false);
    //should wait for other player to join to initialize the board buttons.
    
  
    //this handles all the incoming messages i guess
    socket.onmessage = function (event) {
      let incomingMsg = JSON.parse(event.data);
      console.log(incomingMsg);

      //set player type
      if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
        gs.setPlayerType(incomingMsg.data); //should be "WHITE" or "BLUE"
        if(incomingMsg.data == "WHITE") sb.setStatus(Status["player1Intro"]);
        else sb.setStatus(Status["player2Intro"]);
        //player one should be able to start as soon as player 2 joins
      }
      
      //if player if white, allow them to move once blue has joined.
      if(incomingMsg.type == Messages.T_BEGIN_GAME){
        if(gs.playerType == "WHITE"){
          canInteract(true);
          sb.setStatus(Status["player1Move"]);
        }
        else{
          socket.send(Messages.S_BEGIN_GAME);                    
        }
      }

      //if player is blue, and white made a move update board
      if(incomingMsg.type == Messages.T_SET_WHITE && gs.playerType == "BLUE"){        
        sb.setStatus(Status["player2Move"]);
        gs.updateGame(incomingMsg.data, "WHITE");

        canInteract(true);
      }
      //if player is white, and blue made a move update board
      if(incomingMsg.type == Messages.T_SET_BLUE && gs.playerType == "WHITE"){
        
        sb.setStatus(Status["player1Move"]);
        gs.updateGame(incomingMsg.data, "BLUE");

        canInteract(true);
      }




    };
  
    socket.onopen = function () {
      socket.send("{}");
    };
  
    //server sends a close event only if the game was aborted from some side
    socket.onclose = function () {
      if (gs.whoWon() == null) {
        sb.setStatus(Status["aborted"]);
      }
    };
  
    socket.onerror = function () { };
  })();
