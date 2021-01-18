/*
 * Object representing the word to guess.
 */
function VisibleWordBoard() {
    this.setWord = function(visibleWord) {
      document.getElementById("word").innerHTML = (Array.isArray(visibleWord) ? visibleWord.join("") : visibleWord);
    };
  }
  
  /*
   * Function creating the necessary balloons.
   */
  
  /*
   * Object representing the status bar.
   */
  function StatusBar() {
    this.setStatus = function(status) {
      document.getElementById("status").innerHTML = status;
    };
  }