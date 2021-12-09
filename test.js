const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselbas.ca",
    userId: "aJ48lW" },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userId: "aJ48lW"},
  "uihg33": {
    longURL: "http://www.google.com",
    userId: "ahgut"}
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

const urlsForUser = (id) => {
  const userDatabase = {}
  for (urls in urlDatabase) {
    const userURLs = urlDatabase[urls].userId;
    if(id === userURLs) {
      // console.log(urlDatabase[urls]);
      userDatabase[urls] = urlDatabase[urls];
    }
  }
  return userDatabase;
}

urlsForUser("aJ48lW")

