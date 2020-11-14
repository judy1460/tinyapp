const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user= getUserByEmail("mina@example.com", testUsers)
    const expectedOutput = "userRandomID";
    // Write your assert statement here
  });

  it('should return undefined if the email is not in database', function(){
    const user = getUserByEmail("min@gmail.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(expectedOutput, user);
  })
});