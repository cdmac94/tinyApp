const express = require("express");
const app = express();
const PORT = 3001;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const findUserByEmail = require('./helpers').findUserByEmail;
const urlsForUser = require('./helpers').urlsForUser;
const generateRandomString = require('./helpers.js').generateRandomString;

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselbas.ca",
    userId: "aJ48lW" },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userId: "aJ48lW"}
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


app.get("/", (req, res) => {
  res.redirect("/urls");
});



app.get("/urls", (req, res) => {
  const userId = req.session.sessionName;
  
  const usersURLs = urlsForUser(userId, urlDatabase);

  const templateVars = {
    userId: userId,
    urls: usersURLs
  };
  res.render("urls_index", templateVars);
});

//go to login page

app.get("/login", (req, res) => {
  const templateVars = {userId: req.session.sessionName};
  if (req.session.session) {
    res.redirect("/");
  } else {
    res.render("urls_login", templateVars);
  }
});

//login and 

app.post("/login", (req, res) => {
  const useremail = req.body['email'];
  const userpass = req.body.password;

  // Validate if user is registered and password is a match

  if (!useremail || !userpass) {
    return res.status(400).send("email and password cannot be blank");
  }

  const user = findUserByEmail(useremail, users);
  console.log(user)
  if (!user) {
    return res.status(403).send("a user with that email does not exist");
  }


  if (!bcrypt.compareSync(userpass, user.password)) {
    return res.status(403).send('password does not match');
  }

  req.session.sessionName = user.email;
  res.redirect("/");
});

//logout & clear session

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

//Registration page

app.get("/register", (req, res) => {
  const templateVars = {userId: req.session.sessionName};
  if (req.session.sessionName) {
    res.redirect("/");
  } else {
    res.render("urls_register", templateVars);
  }
});

//Registration process

app.post("/register", (req, res) => {
  const useremail = req.body['email'];
  const userpass = req.body['password'];
  const userId = generateRandomString();
  const encryptedPass = bcrypt.hashSync(userpass, 10);
  
  // Validate if user info is valid and novel
  
  if (!useremail || !userpass) {
    return res.status(400).send("email and password cannot be blank");
  }
  
  const user = findUserByEmail(useremail, users);
  
  if (user) {
    return res.status(400).send("a user already exists with that email");
  }
  
  const newUserId = {
    id: userId,
    email: useremail,
    password: encryptedPass,
  };

  users[userId] = newUserId;
  req.session.sessionName = newUserId.email;
  res.redirect("/");
});


//adding to database

app.post("/urls", (req, res) => {
  const userId = req.session.sessionName;
  
  // Validate if user is logged in

  if (!userId) {
    res.status(401).send("You must be logged in to make a Tiny Url");
    return;
  }
  let tinyUrl = generateRandomString();
  urlDatabase[tinyUrl] = { longURL: req.body.longURL, userId: req.session.sessionName};
  res.redirect(`/urls/${tinyUrl}`);
});

//link to original site

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send("Sorry! this link does not exist");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;

  res.redirect(longURL);
});

// delete link

app.post("/urls/:shortURL/delete", (req, res) => {
  const Id = req.session.sessionName;
  const urlUser = urlDatabase[req.params.shortURL].userId;

  // Validate if user is logged in

  if (!Id) {
    return res.status(401).send("You must be logged in to delete URLs");
  }

  if (Id !== urlUser) {
    return res.status(401).send("You can only delete your own URLs");
  }

  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//link to editing/view page

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    userId: req.session.sessionName,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };

  const Id = req.session.sessionName;
  const urlUser = urlDatabase[req.params.shortURL].userId;

  // Validate if user is logged in  
  
  if (!Id) {
    return res.status(401).send("You must be logged in to edit URLs");
  }

  if (Id !== urlUser) {
    return res.status(401).send("You can only edit your own URLs");
  }
  res.render('urls_show', templateVars);
});


//after pressing submit

app.post("/urls/:shortURL", (req, res) => {
  const newUrl = req.body.longURL;
  urlDatabase[req.params.shortURL]['longURL'] = newUrl;
  console.log(urlDatabase);
  res.redirect(`/urls/${req.params.shortURL}`);
});


app.get("/urls.json", (req, res) => {
  const templateVars = {userId: req.session.sessionName};
  res.json(urlDatabase, templateVars);
});

//web page for link creator 

app.get("/new", (req, res) => {
  const templateVars = {userId: req.session.sessionName};

  const userId = req.session.sessionName;
  
  //check if user is logged in
  
  if (!userId) {
    return res.status(401).send("You must be logged into make new TinyURL");
  }

  res.render("urls_new", templateVars);
});




app.listen(PORT, () => {
  console.log(`TinyApp ready too transform url's on ${PORT}!`);
});
