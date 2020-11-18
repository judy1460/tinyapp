const cookieSession = require('cookie-session');
const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
//const cookieParser = require('cookie-parser');
const { json } = require("body-parser");
//const getUserByEmail = require("./helpers");
app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  secret: "mina",
  maxAge: 24 * 60 * 60 * 1000
}));
app.set("view engine", "ejs");

// Database
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
const getUserByEmail = function(email, users) {
  for (let item in users) {
    if (users[item].email === email) {
      return users[item];
    }
  }
};

app.get("/", (req, res) => {
  id = req.session.user_id;
  if (id){
    res.redirect("/urls");
  } else {
    return res.redirect("/login");
  }
});
const urlsForUser = function(id) {
  let newUrlDatabase = {};
  for (let item in urlDatabase) {
    if (urlDatabase[item].userId === id) {
      newUrlDatabase[item] =  urlDatabase[item];
    }
  }
  return newUrlDatabase;
};
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlsForUser(req.session.user_id), user: users[req.session.user_id]};
  res.render("urls_index", templateVars);

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//Only logged in users can visit the page to create new URL
app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    const templateVars = {user: users[req.session.user_id]};
    res.render("urls_new",templateVars);
  } else {
    res.redirect("/login");
  }
  
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.session.user_id]};
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body);
  res.redirect("/urls");
});

/*function generateRandomString () {
  let rand = Math.random().toString(36).substring(6);
  return rand;
};*/
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const obj = urlDatabase[shortURL];
  res.redirect(obj.longURL);
});
app.post("/urls/:url/delete", (req, res)=>{
  if (!req.session.user_id) {
    const url = req.params.url;
    delete urlDatabase[url];
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

/*app.post("/urls/:url/edit", (req, res) =>{
  if(req.cookies["userId"] !== undefined && req.cookies["userId"] !== null ){
    const url = req.params.url;
    edit urlDatabase[url];
    res.redirect("/urls");
    } else {
      res.redirect("/login");
    }

})*/

app.post("/urls/:shortURL", (req, res)=>{
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  //urlDatabase[url] = res.body.updatedLongUrl;
  res.redirect(longURL);
});

app.get('/login', (req, res)=>{
  const templateVars = {user:users[req.session.user_id]};
  res.render('login', templateVars);
});

app.get('/register', (req, res)=>{
  const templateVars = {user:users[req.session.user_id]};
  res.render('register', templateVars);
});


app.post("/register",(req, res) =>{
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).send("Please provide right email or password");
  }
  if (getUserByEmail(email, users)) {
    return res.status(400).send("Email is existed.");
  }
  
  const id = generateRandomString();
  const hashPass = bcrypt.hashSync(password, 10);
  const user = {
    id,
    email,
    password : hashPass
  };
  users[id] = user;
  req.session.user_id = id;
  res.redirect("/urls");
});

app.post("/login", (req, res)=>{
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(403).send("Please provide right email or password");
  }
  const currentUser = getUserByEmail(email, users);
  if (currentUser) {
    if (bcrypt.compareSync(password, currentUser.password)) {
      req.session.user_id = currentUser.id;
      return res.redirect("/urls");

    } else {
      return res.status(403).send("Error");
    }
  }
});

app.post('/logout', (req, res)=>{
  req.session = null;
  res.redirect("/urls");
});

const generateRandomString = ()=> Math.random().toString(36).substring(2, 8);
const users = {
  "001": {
    id: "001",
    email: "mina@example.com",
    password: bcrypt.hashSync("lovelove", 10)
  },
  "002": {
    id: "002",
    email: "dana@example.com",
    password: bcrypt.hashSync("loplop", 10)
  }
};

