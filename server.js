const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionConfig = require("./sessionConfig");
const app = express();
const port = process.env.PORT || 8000;
const fs = require("fs");
const words = fs
  .readFileSync("/usr/share/dict/words", "utf-8")
  .toLowerCase()
  .split("\n");

app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

app.use("/", express.static("./public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));

var randomWord = words[Math.floor(Math.random() * words.length)];
var theWord;
var spaces = [];
var guesses = [];
var wrong = [];
var right = [];
var win;
var lose;
var rightWord;
var tooLong = false;
var tries = "8";

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/play", function(req, res) {
  console.log(lose);
  spaces = [];
  wrong = [];
  right = [];
  guesses = [];
  lose = false;
  var rightWord;
  tries = "8";
  randomWord = "";
  console.log(req.body);
  randomWord = words[Math.floor(Math.random() * words.length)];
  console.log(randomWord.length);
  theWord = randomWord.split("");
  console.log(theWord);
  for (var i = 0; i < theWord.length; i++) {
    spaces.push("_____");
  }
  console.log(spaces);
  console.log(req.session);

  res.render("play", { spaces: spaces });
});

app.get("/again", function(req, res) {
  req.session.destroy();
  res.redirect("/play");
  lose = false;
  console.log(lose);
});

app.post("/guess", function(req, res) {
  var guess = req.body.guess;
  if (guess.length > 1) {
    return;
  }
  if (wrong.length < 7 && guess.length == 1) {
    guesses.push(guess);
    console.log(req.body.guess);
    if (theWord.indexOf(guess) > -1) {
      right.push(guess);
      for (var i = 0; i < theWord.length; i++) {
        if (theWord[i] == guess) {
          console.log(i + 1);
          spaces[i] = theWord[i];
          console.log(spaces);
          console.log(theWord);
        }
        if (spaces.toString() == theWord.toString()) {
          console.log("you win!");
          var win = true;
        }
      }
    } else {
      wrong.push(guess);
      tries -= "1";
      console.log(tries);
    }
  } else {
    console.log("you lose");
    lose = true;
    rightWord = theWord;
    for (var i = 0; i < theWord.length; i++) {
      if (theWord[i] == rightWord[i]) {
        console.log(i + 1);
        spaces[i] = theWord[i];
      }
    }
  }

  console.log(wrong);

  res.render("play", {
    guesses: guesses,
    spaces: spaces,
    lose: lose,
    tries: tries,
    win: win
  });
});

app.listen(port, function() {
  console.log("Server is running on " + port);
});
