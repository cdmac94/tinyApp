const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
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

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const findUserByEmail = (email) => {
  for(const userId in users) {
    const user = users[userId];
    if(user.email === email) {
      return user;
    }
  }
  return null;
}


app.get("/", (req, res) => {
  const templateVars = {username: users.email}
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const templateVars = {  
    username: req.cookies["username"],
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//login cookie

app.post("/login", (req, res) => {
  console.log(`${req.body['Login']} logged in`)
  res.cookie("username",(req.body['Login']));
  res.redirect("/");
});

//logout & clear cookies
app.post("/logout", (req, res) => {
  console.log(`${req.cookies["username"]} Logged out`);
  console.log(users);
  res.clearCookie("username");
  res.redirect("/");
});

//Registration page

app.get("/register", (req, res) => {
  console.log("New member registering");
  const templateVars = {username: users.email};
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const useremail = req.body['email'];
  const userpass = req.body['password'];
  const userId = generateRandomString()
  
  
  
  if (!useremail || !userpass) {
    return res.status(400).send("email and password cannot be blank");
  };
  
  const user = findUserByEmail(useremail);
  
  if(user) {
    return res.status(400).send("a user already exists with that email")
  }
  
  const newUserId = {
  id: userId, 
  email: useremail, 
    password: userpass,
  };

  users[userId] = newUserId
  console.log(`New user: email: ${useremail}, userpass: ${userpass}, userId: ${userId}`);
  console.log(users)
  res.cookie("username", newUserId.email);
  res.redirect("/");
});


//adding to database

app.post("/urls", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  console.log(`Added ${req.body.longURL} to urlDatabase`);
  let tinyUrl = generateRandomString();
  res.redirect("/urls");
  res.send(urlDatabase[tinyUrl] = req.body.longURL);
});

//link to original site

app.get("/u/:shortURL", (req, res) => {
  const templateVars = {username: req.cookies["username"]}
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//link to editing/view page

app.get("/urls/:shortURL/edit", (req, res) => {
  console.log(`Editing ${urlDatabase[req.params.shortURL]} from urlDatabse`);
  const templateVars = { 
    username: users.email,
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

//after pressing submit

app.post("/urls/:shortURL", (req, res) => {
  console.log(req.body);
  const templateVars = {username: users.email};
  const newUrl = req.body.longURL
  urlDatabase[req.params.shortURL] = newUrl;
  console.log(urlDatabase);
  res.redirect("/");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const templateVars = {username: users.email};
  console.log(`Deleted ${urlDatabase[req.params.shortURL]} from urlDatabse`);
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});


app.get("/urls.json", (req, res) => {
  const templateVars = {username: users.email};
  res.json(urlDatabase, templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: users.email};
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { 
    username: users.email,
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL] };
  console.log(templateVars);
  res.render('urls_show', templateVars);
});



app.listen(PORT, () => {
  console.log(`TinyApp ready too transform url's on ${PORT}!`);
});

