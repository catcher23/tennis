/**
 * Returns the next score in a tennis game given the player that scored.
 *
 * @see {@link http://tennis.about.com/cs/beginners/a/beginnerscore.htm}
 * @param {number[]} score - The current score, player 0 in position 0, player 1 in position 1
 * @param {number} playerIndex - The player that scored
 * @returns {number[]|false} - The new score, player 0 in position 0, player 1 in position 1, or false on any error
 */
function tennis(score, playerIndex) {
    var validScores = new Set(['0', '15', '30', '40', 'A']), s;
    if (!Array.isArray(score) || (playerIndex.toString() !== '0' && playerIndex.toString() !== '1')) {
      console.log('Invalid Input'); //checks if score and playerIndex are in the correct format
      return false;
    } else {
    for(s in score) { //checks in the scores are valid tennis scores
      if (!validScores.has(score[s])) {
        console.log('Invalid Input');
        return false;
      }
    }
    if (score[playerIndex] !== '40' &&  score[playerIndex] !== 'A') {
      if (score[playerIndex] !== '30') {
        score[playerIndex] = (parseInt(score[playerIndex]) + 15).toString(); //adds 15 when score is not 30, 40 or A
      } else {
          score[playerIndex] = (parseInt(score[playerIndex]) + 10).toString(); // adds 10 when score is 30
      }
    } else { // conditions below handle cases when score is 40 or A
      if (score[0] === '40' && score[1] === '40') {
        score[playerIndex] = 'A'; // Takes player to advantage if scores are both 40
      } else if (score[0] === 'A' && parseInt(playerIndex) === 1) {
        score[0] = '40'; // Decrements to 40 when player who doesn't have advantage scores a point
      } else if (score[1] === 'A' && parseInt(playerIndex) === 0) {
        score[1] = '40';
      } else { // Handles the case when an advantaged player scores a point
        score[playerIndex] = 'WIN';
      }
  }
  return score;
  }
}

function assert(score, expectedScore, description) {
    if (Array.isArray(score) && Array.isArray(expectedScore)) {
        if (score.length !== expectedScore.length) {
            console.log('FAIL TEST: ' + description);
            return false;
        }
        if (score[0] !== expectedScore[0] || score[1] !== expectedScore[1]) {
            console.log('FAIL TEST: ' + description);
            console.log(score);
            return false;
        }
    } else if (score !== expectedScore) {
        console.log('FAIL TEST: ' + description);
        return false;
    }
    console.log('PASS TEST: ' + description);
    return true;
}

function test() {
    assert(tennis(['0', '0'], 0), ['15', '0'], 'adds a point to the correct player');
    assert(tennis(['30', '15'], 1), ['30', '30'], 'adds a point to the correct player');
    assert(tennis(['0', '40'], 1), ['0', 'WIN'], 'player can win from 40');
    assert(tennis(['40', '40'], 0), ['A', '40'], 'takes player to advantage');
    assert(tennis(['A', '40'], 0), ['WIN', '40'], 'player can win from advantage');
    assert(tennis(['40', 'A'], 0), ['40', '40'], 'drops player from advantage');
    assert(tennis(['30', '40'], 0), ['40', '40'], 'deuce');
    assert(tennis(['x', '40'], 0), false, 'handles invalid score input');
    assert(tennis(['15', '40'], 3), false, 'handles invalid player index input');
}

function readTextFile(file) {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
  text = new XMLHttpRequest(), lines, characters, allText;
  text.open("GET", file, false);
  text.onreadystatechange = function () {
    if(text.readyState === 4) {
      if(text.status === 200 || text.status === 0) {
        allText = text.responseText;
          run(allText);
      }
    }
  };
  text.send(null);
}

function run(text) { // main function which prints the output
  var lines = text.split(/\n/), i, j, k, score, count, errors = 0,
  winners = {0:0, 1:0}, wins, key, diff, winner;
  linesLoop:
    for(i = 0; i < lines.length; i++){
      characters = lines[i].split('');
      score = ['0','0'];
      count = -1; //records the match number, starts at 0 when loop begins
  charactersLoop:
    for(j = 0; j < characters.length; j++) {
      if (characters[j] === '0' || characters[j] === '1') {
        score = tennis(score, characters[j]);
        count += 1;
      } else if (j === characters.length - 1) {
        console.log('TIE'); //returns a tie if the end of the line is reached and no win
        break;
      } else {
        errors += 1;
        console.log('ERROR'); // returns an error if not 0, 1, or end of line
        break;
      }
  scoreLoop:
    for(k = 0; k < 2; k++) {
      if (score[k] === 'WIN') {
        winners[k] += 1;
        console.log('WIN ' + k + ' ' + count);
        break charactersLoop;
      }
    }
    }
  }
  wins = findWins(winners);
  win = findWinner(wins);
  winner = win[0];
  diff = win[1];

  console.log(winner.toString() + diff.toString() + errors.toString());
}

function findWins(winners) { //helper function to find wins for each player
  var wins = [], keys;
  for (var key in winners) {
    wins.push(winners[key]);
  }
  return wins;
}

function findWinner(wins) { //helper function to find the winner and the score difference
  var diff, winner;
  if(wins[0] > wins[1]) {
    diff = wins[0] - wins[1];
    winner = 0;
    return [winner, diff];
  } else if (wins[1] > wins[0]) {
    diff = wins[1] - wins[0];
    winner = 1;
    return [winner, diff];
  } else {
    diff = 0;
    winner = 'X';
    return [winner, diff];
  }
}

if (require.main === module) {
  test();
  readTextFile("file:///Users/dannylau/desktop/tennis/tennisinput.txt");
  // the path above is my local path, replace with your local path
}
