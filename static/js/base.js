/** global namespace for Codefin projects. */
var codefin = codefin || {};

/** Quattro namespace for this sample. */
codefin.quattro = codefin.quattro || {};

/** Remove after unit testing is finished */
// codefin.quattro = exports;

/**
 * Status for an unfinished game.
 * @type {number}
 */
codefin.quattro.NOT_DONE = 0;

/**
 * Status for a victory.
 * @type {number}
 */
codefin.quattro.WON = 1;

/**
 * Status for a loss.
 * @type {number}
 */
codefin.quattro.LOST = 2;

/**
 * Status for a tie.
 * @type {number}
 */
codefin.quattro.TIE = 3;

/**
 * Strings for each numerical status.
 * @type {Array.number}
 */
codefin.quattro.STATUS_STRINGS = [
   'NOT_DONE',
   'WON',
   'LOST',
   'TIE'
];

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
codefin.quattro.signedIn = false;

/**
 * Whether or not the game is waiting for a user's move.
 * @type {boolean}
 */
codefin.quattro.waitingForMove = true;

/**
 * Signs the user out.
 */
codefin.quattro.signout = function() {
  document.getElementById('signinButtonContainer').classList.add('visible');
  document.getElementById('signedInStatus').classList.remove('visible');
  codefin.quattro.setBoardEnablement(false);
  codefin.quattro.signedIn = false;
}

/**
 * Handles a square click.
 * @param {MouseEvent} e Mouse click event.
 */
codefin.quattro.clickSquare = function(e) {
  if (codefin.quattro.waitingForMove) {
    var button = e.target;
    var row = codefin.quattro.findValidPosition(e);
    var victory = document.getElementById('victory');
    victory.innerHTML = '';
    if(row == -1) {
      // show message saying column complete please another column
      victory.innerHTML = 'Column complete. Please choose a different one.';
    } else {
      var rowClassName = "row-" + row;
      var rowElement = document.getElementsByClassName(rowClassName);
      
      for(var i = 0; i < rowElement[0].children.length; i++) {
        if(rowElement[0].children[i].className == button.className) {
          rowElement[0].children[i].style.backgroundColor = 'red';
          rowElement[0].children[i].style.color = 'red';
          rowElement[0].children[i].innerHTML = 'X';
        }
      }
      codefin.quattro.waitingForMove = false;
      var boardString = codefin.quattro.getBoardString();

      var status = codefin.quattro.checkForVictory(boardString);
      if (status == codefin.quattro.NOT_DONE) {
        codefin.quattro.getComputerMove(boardString);
      } else {
        codefin.quattro.handleFinish(status);
      }
    }
  }
};

codefin.quattro.findValidPosition = function(e) {
  var columnValues = [];
  var validRow = -1;
  var button = e.target;
  var buttonsCol = document.getElementsByClassName(button.className);
  
  for (var i = 0; i < buttonsCol.length; i++) {
    columnValues.push(buttonsCol[i].innerHTML);
  }
  
  for(var i=columnValues.length; i >= 0; i--) {
    if(columnValues[i] == '-') {
      validRow = i;
      break;
    }
  }
  return validRow;
};

/**
 * Resets the game board.
 */
// google.devrel.samples.ttt.resetGame = function() {
//   var buttons = document.querySelectorAll('td');
//   for (var i = 0; i < buttons.length; i++) {
//     var button = buttons[i];
//     button.removeEventListener('click', google.devrel.samples.ttt.clickSquare);
//     button.addEventListener('click', google.devrel.samples.ttt.clickSquare);
//     button.innerHTML = '-';
//   }
//   document.getElementById('victory').innerHTML = '';
//   google.devrel.samples.ttt.waitingForMove = true;
// };

/**
 * Gets the computer's move.
 * @param {string} boardString Current state of the board.
 */
codefin.quattro.getComputerMove = function(boardString) {
  gapi.client.quattro.board.getmove({'state': boardString}).execute(
  function(resp) {
    codefin.quattro.setBoardFilling(resp.state);
    var status = codefin.quattro.checkForVictory(resp.state);
    if (status != codefin.quattro.NOT_DONE) {
      codefin.quattro.handleFinish(status);
    } else {
      codefin.quattro.waitingForMove = true;
    }
  });
};

/**
 * Shows or hides the board and game elements.
 * @param {boolean} state Whether to show or hide the board elements.
 */
codefin.quattro.setBoardEnablement = function(state) {
  if (!state) {
    document.getElementById('board').classList.add('hidden');
    // document.getElementById('button-area').classList.add('hidden');
    // document.getElementById('lmargin').classList.add('hidden');
    //document.getElementById('gameHistoryWrapper').classList.add('hidden');
    document.getElementById('warning').classList.remove('hidden');
  } else {
    document.getElementById('board').classList.remove('hidden');
    // document.getElementById('button-area').classList.remove('hidden');
    // document.getElementById('lmargin').classList.remove('hidden');
    //document.getElementById('gameHistoryWrapper').classList.remove('hidden');
    document.getElementById('warning').classList.add('hidden');
  }
};

/**
 * Sets the filling of the squares of the board.
 * @param {string} boardString Current state of the board.
 */
codefin.quattro.setBoardFilling = function(boardString) {
  var buttons = document.querySelectorAll('td');
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    if(boardString.charAt(i) == 'O') {
      button.style.backgroundColor = 'yellow';
      button.style.color = 'yellow';
    }
    button.innerHTML = boardString.charAt(i);
  }
};

/**
 * Checks for a victory condition.
 * @param {string} boardString Current state of the board.
 * @return {number} Status code for the victory state.
 */
codefin.quattro.checkForVictory = function(boardString) {
  var status = codefin.quattro.NOT_DONE;

  // Checks rows.
  for(var row=5; row >= 0; row--) {
    for(var col=0; col <= 3; col++) {
      var rowString=codefin.quattro.getStringsAtPositions(boardString,
        (row*7)+col, (row*7)+col+1,(row*7)+col+2,(row*7)+col+3);
      status |= codefin.quattro.checkSectionVictory(rowString);      
    }
  }

  // Checks columns.
  for(var col=0; col <= 6; col++) {
    for(var row=5; row >= 3; row--) {
      var colString=codefin.quattro.getStringsAtPositions(boardString,
        (row*7)+col, (row*7)+col-7,(row*7)+col-14,(row*7)+col-21);
      status |= codefin.quattro.checkSectionVictory(colString);      
    }
  }

  // Check diagonals left to right
  for(var col=0; col <= 3; col++) {
    for(var row=5; row >= 3; row--) {
      var diagString=codefin.quattro.getStringsAtPositions(boardString,
        (row*7)+col, (row*7)+col-6,(row*7)+col-12, (row*7)+col-18);
      status |= codefin.quattro.checkSectionVictory(diagString);      
    }
  }

  // Check diagonals right to left
  for(var col=6; col >= 3; col--) {
    for(var row=5; row >= 3; row--) {
      var diagString=codefin.quattro.getStringsAtPositions(boardString,
        (row*7)+col, (row*7)+col-8,(row*7)+col-16, (row*7)+col-24);
      status |= codefin.quattro.checkSectionVictory(diagString);
    }
  }

  if (status == codefin.quattro.NOT_DONE) {
    if (boardString.indexOf('-') == -1) {
      return codefin.quattro.TIE;
    }
  }

  return status;
};

/**
 * Checks whether a set of three squares are identical.
 * @param {string} section Set of three squares to check.
 * @return {number} Status code for the victory state.
 */
codefin.quattro.checkSectionVictory = function(section) {
  var a = section.charAt(0);
  var b = section.charAt(1);
  var c = section.charAt(2);
  var d = section.charAt(3);
  if (a == b && a == c && a == d) {
    if (a == 'X') {
      return codefin.quattro.WON;
    } else if (a == 'O') {
      return codefin.quattro.LOST
    }
  }
  return codefin.quattro.NOT_DONE;
};

/**
 * Gets the values of the board at the given positions.
 * @param {string} boardString Current state of the board.
 * @param {number} first First element to retrieve.
 * @param {number} second Second element to retrieve.
 * @param {number} third Third element to retrieve.
 */
codefin.quattro.getStringsAtPositions = function(boardString, first,second, third, fourth) {
  return [boardString.charAt(first),
          boardString.charAt(second),
          boardString.charAt(third),
          boardString.charAt(fourth)].join('');
};

/**
 * Handles the end of the game.
 * @param {number} status Status code for the victory state.
 */
codefin.quattro.handleFinish = function(status) {
  var victory = document.getElementById('victory');
  if (status == codefin.quattro.WON) {
    victory.innerHTML = 'You win!';
  } else if (status == codefin.quattro.LOST) {
    victory.innerHTML = 'You lost!';
  } else {
    victory.innerHTML = 'You tied!';
  }
  // codefin.quattro.sendResultToServer(status);
};

/**
 * Gets the current representation of the board.
 * @return {string} Current state of the board.
 */
codefin.quattro.getBoardString = function() {
  var boardStrings = [];
  var buttons = document.querySelectorAll('td');
  for (var i = 0; i < buttons.length; i++) {
    boardStrings.push(buttons[i].innerHTML);
  }
  return boardStrings.join('');
};

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 * @param {string} tokenEmail The email parsed from the auth/ID token.
 */
codefin.quattro.init = function(apiRoot, tokenEmail) {
  // Loads the Tic Tac Toe API asynchronously, and triggers login
  // in the UI when loading has completed.
  var callback = function() {
    codefin.quattro.signedIn = true;
    document.getElementById('userLabel').innerHTML = tokenEmail;
    codefin.quattro.setBoardEnablement(true);
    // codefin.quattro.queryScores();
  }
  gapi.client.load('quattro', 'v1', callback, apiRoot);

  var buttons = document.querySelectorAll('td');
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.addEventListener('click', codefin.quattro.clickSquare);
  }

  // var reset = document.querySelector('#restartButton');
  // reset.addEventListener('click', google.devrel.samples.ttt.resetGame);
};