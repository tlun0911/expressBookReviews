const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  console.log(users);
  let newUser = req.body.username;
  let newPassword = req.body.password;
  if(!newUser.isValid){
    return res.send("Please enter a username and password");
  }
  else if (newUser in users){
    return res.send("User is already registered");
  }
  else{
    users.push({"userName": newUser, "password": newPassword});
    res.send("User has been added!");
  }
  console.log(users);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let newISBN = req.params.isbn;
    return res.send(JSON.stringify(books[newISBN]), null, 4);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const newAuthor = req.params.author;
  const keys = Object.keys(books);
  keys.forEach((key) => {
    let tempAuthor = books[key];
        if (tempAuthor.author === newAuthor) {
            return res.send(JSON.stringify(books[key], null, 4))
        }

    });    

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const newTitle= req.params.title;
  const keys = Object.keys(books);
  keys.forEach((key) => {
    let tempTitle = books[key];
    if(tempTitle.title === newTitle)   {
        return res.send(JSON.stringify(books[key], null, 4));
    } 
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let newISBN = req.params.isbn;
  let newReview = books[newISBN];
  return res.send(JSON.stringify(newReview.review), null, 4);
});

module.exports.general = public_users;
