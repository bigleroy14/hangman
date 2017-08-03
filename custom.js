var word = [];
var numGuesses = 9;
var guessedLetters = [];
var correctWord = [];
var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
var start = false;
var wins = 0;
var losses = 0;

$(document).ready(function() {
    // $('#alphabet').click(function() {
    //     $(this).addClass('disabled');
    // })
    $('#startBtn').click(function() {
        $('#startDiv').css("display", "none");
        $('#alphabet').css("display", "block");
        restart();
        startGame();
    })

    document.onkeyup = function(key) {
    if (start === true) {
        if (key.keyCode >= 65 && key.keyCode <= 90) {
            var keyPress = (String.fromCharCode(key.keyCode));
            if (alphabet.indexOf(keyPress) != -1) {
                userGuess(keyPress);
                disableButton(keyPress);
            }
        }
    } else if (key.keyCode == 13) {
        $('#startDiv').css("display", "none");
        $('#alphabet').css("display", "block");
        restart();
        startGame();
    }
}
});


function getRandomWord() {
    var requestStr = "http://setgetgo.com/randomword/get.php"
    var randomWord = "";
    $.ajax({
        type: "GET",
        url: requestStr,
        dataType: "jsonp",
        async: false,
        success: function(data) {
            word = data.Word.split('');
            console.log(word.toString());
            fillData();
        },
        error: function(errMessage) {
            console.log(errMessage);
        }
    });
}

function startGame() {
    getRandomWord()
    $('#guessesRemaining').css("display","block");
    for (var i = 0; i < alphabet.length; i++) {
        var btn = $('<button id="btn-' + alphabet[i] + '" class="btn btn-primary" style="margin-right:5px;margin-bottom:5px; width:40px;text-align:center;" value="' + alphabet[i] + '">' + alphabet[i] + '</>');
        btn.bind('click', function() {
            $(this).addClass('disabled  btn-warning');
            userGuess($(this).val());
        })
        $('#alphabet').append(btn);
    }
    start = true;
}

function fillData() {
    for (var i = 0; i < word.length; i++) {
        correctWord.push("_");
        console.log(correctWord);
        var underscoreDiv = $('<p id="underscore' + i + '" style="display:inline; padding-right:10px; font-size:30px;">_</p>');
        $('#wordDiv').append(underscoreDiv);
    }
}

function userGuess(letter) {
    if (guessedLetters.indexOf(letter) == -1) {
        if (word.indexOf(letter.toLowerCase()) > -1) {
            correctWord[word.indexOf(letter)] = letter
            for (var i = 0; i < word.length; i++) {
                if (word[i] === letter.toLowerCase()) {
                    correctWord[i] = letter;
                    var underscoreID = "#underscore" + i;
                    $(underscoreID).html(letter);
                }
            }
        } else {
            decrementGuesses();
        }
        guessedLetters.push(letter);
    }
    if(correctWord.indexOf("_")==-1){
        $('#guessesRemaining').html("YOU WIN!!!");
        start = false;
        $('#startDiv').css("display", "block");
        $('#startBtn').html("Play Again");
        $('#alphabet').css("display", "none");
        wins++;
        var winDiv = $('#wins').html()
        $('#wins').html(winDiv.replace(/.$/, wins));
    }
}

function disableButton(id) {
    console.log(id);
    var button = "#btn-" + id;
    $(button).addClass('disabled btn-warning');
}

function decrementGuesses() {
    var text = $('#guessesRemaining').html()
    numGuesses--;
    var picSRC = $('#currentState').attr("src");
    var picNum = parseInt(picSRC.substring(picSRC.length-5,picSRC.length-4));
    picNum++;
    var newPic = "assets/images/wrong"+picNum+".png";
    $('#currentState').attr("src",newPic);
    $('#guessesRemaining').html(text.replace(/.$/, numGuesses));
    if (numGuesses === 0) {
        $('#guessesRemaining').html("LOSER.....");
        start = false;
        $('#startDiv').css("display", "block");
        $('#startBtn').html("Try Again");
        $('#alphabet').css("display", "none");
        losses++;
        var lossDiv = $('#losses').html()
        $('#losses').html(lossDiv.replace(/.$/, losses));
        $('#currentState').attr("src","assets/images/dead.png");
    }
}

function restart() {
    $('#alphabet').html("");
    $('#wordDiv').html("");
    numGuesses = 9;

    $('#guessesRemaining').html("Guesses Remaining: " + numGuesses)
    word = [];
    guessedLetters = [];
    correctWord = [];
    start = false;
    $('#currentState').attr("src","assets/images/wrong0.png");
}