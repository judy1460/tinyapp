const getUserByEmail = function(email, users) {
  for (let item in users) {
    if (users[item].email === email) { 
      return users[item];
     } 
    }
  };
  
  module.exports = {getUserByEmail};