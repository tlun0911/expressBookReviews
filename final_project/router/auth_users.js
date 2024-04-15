const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "Tom", password: "mypassword"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
}

if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access');
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const userName = req.session.authorization.userName;
  const newReview = req.query.review;

  let bookReviews = books[isbn].reviews;

  Object.keys(bookReviews).forEach((key) =>{
    const tempReview = bookReviews[key];
    if (!tempReview){
      bookReviews = {"userName": userName, "review": newReview};
    }
    else if (tempReview.userName === userName){
      bookReviews[key] = {"review": newReview};
    }
    else{
      bookReviews = {...bookReviews, ...newReview};
    }

  })


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
