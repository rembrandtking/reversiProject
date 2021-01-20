let soundWhite = new Audio("../data/c.mp3");
let soundBlue = new Audio("../data/g.mp3");

function GameState(ui, socket) {
    this.playerType = null;
    this.pointsWhite = 0;
    this.pointsBlue = 0;
    this.UIManager = ui;
    this.boardManager = new BoardManager();
    this.boardManager.initialize();
    
  this.getPlayerType = function () {
    return this.playerType;
  };

  this.setPlayerType = function (p) {
    this.playerType = p;
  };

  this.whoWon = function () {
    console.log(this.boardManager.validMoves.length);
    if(this.boardManager.validMoves.length > 0)
      return null;

    console.log(parseInt(this.pointsWhite) + 1);
    if(+this.pointsBlue > +this.pointsWhite){
      return "BLUE";
    }
    if(+this.pointsBlue < +this.pointsWhite){
      return "WHITE";
    }
  };

  this.endGame = function (winner) {
    console.log(winner);
    if (winner == null)
    return;
  
    if (winner == this.playerType) {
      ui.setStatus(Status["gameWon"]);
      var outgoingMsg = Messages.O_GAME_WON_BY;
      outgoingMsg.data = winner;
      socket.send(JSON.stringify(outgoingMsg));
  } else {
    ui.setStatus(Status["gameLost"]);
      var outgoingMsg = Messages.O_GAME_WON_BY;
      outgoingMsg.data = winner;
      socket.send(JSON.stringify(outgoingMsg));
  }
  
  //send message to other player.
  socket.close();
  };

  this.updateScore = function () {
    //Calculate and store
    pointsWhite = this.boardManager.getPieceCount(1);
    pointsBlue = this.boardManager.getPieceCount(2);

    //render
    this.UIManager.setScore(pointsWhite, pointsBlue);
  };

    

  //update the game, do this BEFORE the new player gets to make a move
  this.updateGame = function (clickedBox, color) {
    //the clickedPiece number can be assumed to be a valid move, this should have been checked on other client
    //so we only need to update all required pieces
    //we then get the new score for both players.
    //we now make this player move

    //place the piece in the matrix and update UI
    this.boardManager.placePiece(clickedBox, color);
    this.boardManager.changePieces(clickedBox, color);

    //update the score in memory and UI
    this.updateScore();

    if(color == "WHITE") {
      //soundWhite.play();
    }
    else {
      //soundBlue.play();
    }

    //if the current player didnt place this part, no need to resend messages.
    if(this.playerType != color) {
      //get the valid moves
      return;
    }

    //disable movement on current player
    canInteract(false);
    
    if(this.playerType == "WHITE"){
      ui.setStatus(Status["player1Wait"]);
      var outgoingMsg = Messages.O_SET_WHITE;
      outgoingMsg.data = clickedBox;
      socket.send(JSON.stringify(outgoingMsg));
    }
    else{
      ui.setStatus(Status["player2Wait"]);
      var outgoingMsg = Messages.O_SET_BLUE;
      outgoingMsg.data = clickedBox;
      socket.send(JSON.stringify(outgoingMsg));
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
            if (clickedBox == "") return;
            if(!gs.boardManager.isValidMove(clickedBox)) {
              //say its not valid
              return;
            }
            gs.updateGame(clickedBox, gs.playerType);
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
    var ui = new UIManager();
  
    //no object, just a function  
    var gs = new GameState(ui, socket);

    var boardSetup = new BoardSetup(gs);
    boardSetup.initialize();
    canInteract(false);
    //should wait for other player to join to initialize the board buttons.
    
  
    //this handles all the incoming messages i guess
    socket.onmessage = function (event) {
      let incomingMsg = JSON.parse(event.data);
      console.log(incomingMsg);

      //set player type
      if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
        gs.setPlayerType(incomingMsg.data); //should be "WHITE" or "BLUE"
        if(incomingMsg.data == "WHITE") ui.setStatus(Status["player1Intro"]);
        else ui.setStatus(Status["player2Intro"]);
        //player one should be able to start as soon as player 2 joins
      }
      
      //if player if white, allow them to move once blue has joined.
      if(incomingMsg.type == Messages.T_BEGIN_GAME){
        if(gs.playerType == "WHITE"){

          ui.setStatus(Status["player1Move"]);
          gs.boardManager.determineValidMoves(1);
          canInteract(true);          
        }
        else{
          socket.send(Messages.S_BEGIN_GAME);                    
        }
      }

      if(incomingMsg.type == Messages.O_GAME_WON_BY && gs.playerType == "BLUE"){ 
        console.log(incomingMsg.type)
        if(gs.PlayerType == incomingMsg.data){
          ui.setStatus(Status["gameWon"]);
          canInteract(false);
        }
        else{
          ui.setStatus(Status["gameLost"]);
          canInteract(false);
        }
      } 

      if(incomingMsg.type == Messages.O_GAME_WON_BY && gs.playerType == "WHITE"){ 
        console.log(incomingMsg.type)
        if(gs.PlayerType == incomingMsg.data){
          ui.setStatus(Status["gameWon"]);
          canInteract(false);
        }
        else{
          ui.setStatus(Status["gameLost"]);
          canInteract(false);
        }
      } 
      //if player is blue, and white made a move update board
      if(incomingMsg.type == Messages.T_SET_WHITE && gs.playerType == "BLUE"){  
        ui.setStatus(Status["player2Move"]);
        gs.updateGame(incomingMsg.data, "WHITE");
        gs.boardManager.determineValidMoves(2);
        let winner = gs.whoWon();
        console.log(winner);
        if(winner == null){
          canInteract(true);
        }
        else{
          canInteract(false);
          gs.endGame(winner);
        }
        
      }
      //if player is white, and blue made a move update board
      if(incomingMsg.type == Messages.T_SET_BLUE && gs.playerType == "WHITE"){
        
        ui.setStatus(Status["player1Move"]);
        gs.updateGame(incomingMsg.data, "BLUE");
        gs.boardManager.determineValidMoves(1);
        let winner = gs.whoWon();
        console.log(winner);
        if(winner == null){
          canInteract(true);
        }
        else{
          canInteract(false);
          gs.endGame(winner)
        }
      }
    };

   
  
    socket.onopen = function () {
      socket.send("{}");
    };
  
    //server sends a close event only if the game was aborted from some side
    socket.onclose = function () {
      if (gs.whoWon() == null) {
        ui.setStatus(Status["aborted"]);
      }
    };
  
    socket.onerror = function () { };
  })();
