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

let startDate = new Date().getTime();


setInterval(function() {
  let now = new Date().getTime();

  let timePassed = now - startDate;

  let minutes = Math.floor((timePassed % (3600000)) / (60000));
  let seconds = Math.floor((timePassed % (1000 * 60)) / 1000);

  if(minutes < 10) minutes = "0" + minutes;
  if(seconds < 10) seconds = "0" + seconds;

  // Display the result in the element with id="demo"
  document.getElementById("timer").innerHTML = minutes + ":" + seconds;

}, 1000);


