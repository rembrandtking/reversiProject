// handles the status bar
  function UIManager() {
    this.setStatus = function(status) {
      document.getElementById("status").innerHTML = status;
    };

    this.setScore = function(white, blue) {
      document.getElementById("scoreWhite").innerHTML = white;
      document.getElementById("scoreBlue").innerHTML = blue;
    };
  }