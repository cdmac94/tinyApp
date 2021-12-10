const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));
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

const findUserByEmail = (email) => {
  for(const userId in users) {
    const user = users[userId];
    if(user.email === email) {
      return user;
    }
  }
  return null;
}

const urlsForUser = (id) => {
  const userDatabase = {}
  for (urls in urlDatabase) {
    const userURLs = urlDatabase[urls].userId;
    if(id === userURLs) {
      userDatabase[urls] = urlDatabase[urls];
    }
  }
  return userDatabase;
}


app.get("/", (req, res) => {
  const templateVars = {user_id: req.session["user_id"]}
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const userId = req.session.sessionName;
  
  const usersURLs = urlsForUser(userId);

  const templateVars = {  
    user_id: userId,
    urls: usersURLs
   };
  res.render("urls_index", templateVars);
});

//login cookie

app.get("/login", (req, res) => {
  const templateVars = {user_id: req.session.sessionName};
  if (req.session.session){
    res.redirect("/");
  } else {
  res.render("urls_login", templateVars)
  }
});

app.post("/login", (req, res) => {
  const useremail = req.body['email'];
  const userpass = req.body['password'];

  if (!useremail || !userpass) {
    return res.status(400).send("email and password cannot be blank");
  };

  const user = findUserByEmail(useremail);

  
  console.log(userpass)

  if(!user){
    return res.status(403).send("a user with that email does not exist")
  }

  if(bcrypt.compareSync(userpass, user.email)) {
    return res.status(403).send('password does not match')
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
  const templateVars = {user_id: req.session.sessionName};
  if (req.session.sessionName){
    res.redirect("/")
  } else {
    console.log("New member registering");
  res.render("urls_register", templateVars);
  }
});

app.post("/register", (req, res) => {
  const useremail = req.body['email'];
  const userpass = req.body['password'];
  const userId = generateRandomString();
  const encryptedPass = bcrypt.hashSync(userpass, 10);
  
  console.log(userpass);
  
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
  password: encryptedPass,
  };

  users[userId] = newUserId
  console.log(`New user: email: ${useremail}, userpass: ${encryptedPass}, userId: ${userId}`);
  req.session.sessionName = newUserId.email
  res.redirect("/");
});


//adding to database

app.post("/urls", (req, res) => {
  const templateVars = {user_id: req.session.sessionName}
  const userId = req.session.sessionName
  
  if(!userId) {
  res.status(401).send("You must be logged in to make a Tiny Url");
  return
  }
  console.log(`Added ${req.body.longURL} to urlDatabase`);
  let tinyUrl = generateRandomString();
  urlDatabase[tinyUrl] = { longURL: req.body.longURL, userId: req.session.sessionName};
  console.log(urlDatabase)
  res.redirect("/urls");
});

//link to original site

app.get("/u/:shortURL", (req, res) => {
  const templateVars = {user_id: req.session.sessionName}
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(401).send("Sorry! this link does not exist");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  const shortURL = urlDatabase[req.params.shortURL].userId;

  console.log(shortURL)
  console.log(longURL);
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const templateVars = { 
    user_id: req.session["user_id"],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL };
  const Id = req.session["user_id"];
  const urlUser = urlDatabase[req.params.shortURL].userId;
  console.log(templateVars)
  console.log(urlUser);
  if(!Id) {
    return res.status(401).send("You must be logged in to delete URLs");
  }

  if(Id !== urlUser) {
    return res.status(401).send("You can only delete your own URLs");
  }

  console.log(`Deleted ${urlDatabase[req.params.shortURL].longURL} from urlDatabse`);
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//link to editing/view page

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { 
    user_id: req.session["user_id"],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL
  };

  const Id = req.session.sessionName;
  const urlUser = urlDatabase[req.params.shortURL].userId;
  
  console.log(urlUser);
  if(!Id) {
    return res.status(401).send("You must be logged in to edit URLs");
  }

  if(Id !== urlUser) {
    return res.status(401).send("You can only edit your own URLs");
  }
  console.log(templateVars.longURL)
  console.log(templateVars.shortURL);
  res.render('urls_show', templateVars);
});


//after pressing submit

app.post("/urls/:shortURL", (req, res) => {
  const templateVars = {user_id: req.session.sessionName};
  const newUrl = req.body.longURL
  urlDatabase[req.params.shortURL]['longURL'] = newUrl;
  console.log(urlDatabase);
  res.redirect("/");
});

app.get("/urls.json", (req, res) => {
  const templateVars = {user_id: req.session.sessionName};
  res.json(urlDatabase, templateVars);
});

app.get("/new", (req, res) => {
  const templateVars = {user_id: req.session.sessionName};

  const userId = req.session.sessionName;
  
  if(!userId) {
    return res.status(401).send("You must be logged into make new TinyURL");
  }

  res.render("urls_new", templateVars);
});




app.listen(PORT, () => {
  console.log(`TinyApp ready too transform url's on ${PORT}!`);
});

