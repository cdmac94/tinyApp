const { assert } = require('chai');

const findUserByEmail = require('../helpers').findUserByEmail;
const urlsForUser = require('../helpers.js').urlsForUser;

const testUsers = {
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

const testurlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselbas.ca",
    userId:"userRandomID" },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userId:"userRandomID"},
  "w3mjY1" : {
    longURL: "http://www.tsn.ca",
    userId: "h6N9eW"
  }
};


describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });

  it('should return null with an invalid email', function() {
    const user = findUserByEmail("usr@example.com", testUsers);
    const expectedUserID = null;
    assert.equal(user, expectedUserID);
  });

});

describe('urlsForUser', function() {
  it('should return url database that includes only urls with a matching id', function() {
    const database = urlsForUser("userRandomID", testurlDatabase);
    const expectedUrlDatabase =  {
      "b2xVn2": {
        longURL: "http://www.lighthouselbas.ca",
        userId: "userRandomID"},
      "9sm5xK": {
        longURL: "http://www.google.com",
        userId: "userRandomID"}
    };
    
    assert.deepEqual(database, expectedUrlDatabase);
  });

  it('should return null with an invalid email', function() {
    const database = urlsForUser("userRandom", testurlDatabase);
    const expectedUrlDatabase =  {};
    
    assert.deepEqual(database, expectedUrlDatabase);
  });

});