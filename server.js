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
function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    next();
  }
}

var randomWord = words[Math.floor(Math.random() * words.length)];
var theWord;
var spaces = [];
var guesses = [];
var wrong = [];
var right = [];

app.get("/", function(req, res) {
  console.log(randomWord.length);
  theWord = randomWord.split("");
  console.log(theWord);
  for (var i = 0; i < theWord.length; i++) {
    spaces.push("_____");
  }
  console.log(spaces);
  res.render("index");
});

app.get("/play", function(req, res) {
  res.render("play", { spaces: spaces });
});

app.post("/guess", function(req, res) {
  var guess = req.body.guess;
  guesses.push(guess);
  console.log(req.body.guess);
  if (theWord.indexOf(guess) > -1) {
    right.push(guess);
    for (var i = 0; i < theWord.length; i++) {
      if (theWord[i] == guess) {
        console.log(i + 1);
        spaces[i] = theWord[i];
      }
    }
  }

  res.render("play", { guesses: guesses, spaces: spaces });
});

app.listen(port, function() {
  console.log("Server is running on " + port);
});
