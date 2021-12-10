const findUserByEmail = (email, database) => {
  for (const userId in database) {
    const user = database[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

const urlsForUser = (id, database) => {
  const userDatabase = {};
  for (urls in database) {
    const userURLs = database[urls].userId;
    if (id === userURLs) {
      userDatabase[urls] = database[urls];
    }
  }
  return userDatabase;
};

//Inpsipired by https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

const generateRandomString = () => {
  let tinyName = "";
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  let characterLength = characters.length;
  for (let i = 0; i < 6; i++) {
    tinyName += characters.charAt(Math.floor(Math.random() * characterLength));
  } return tinyName;
};


module.exports = {findUserByEmail, urlsForUser, generateRandomString};