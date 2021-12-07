const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//Inpsipired by https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

function generateRandomString () {
  let tinyName = "";
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  let characterLength = characters.length;
  for (let i = 0; i < 6; i++) {
    tinyName += characters.charAt(Math.floor(Math.random() * characterLength));
  } return tinyName;
};


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselbas.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!, How's it hanging?");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let tinyUrl = generateRandomString();
  res.send(urlDatabase[tinyUrl] = req.body.longURL);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete (urlDatabase[tinyUrl].req.body.longURL);
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[shortURL] };
  res.render('urls_show', templateVars);
});



app.listen(PORT, () => {
  console.log(`TinyApp ready too transform url's on ${PORT}!`);
});

