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
  const userName = req.session.authorization.username;
  const newReview = req.body.review;

  let bookReviews = books[isbn].reviews;
  console.log(bookReviews);

  if (bookReviews={}){
    bookReviews = {"userName": userName, "review": newReview};
    console.log(bookReviews);
    res.send("Review was added!" + ` User: ${userName} Review: ${newReview}`);
    return;
  }
    Object.keys(bookReviews).forEach((key) =>{
        let tempReview = bookReviews[key];
        console.log(tempReview);
        if (tempReview.userName === userName){
            bookReviews[key] = {"review": newReview};
            res.send("Review was updated");
            return;
    }
        else if(!tempReview.userName === userName){
            bookReviews = {...bookReviews, ...newReview};
            res.send("Review was added!");
            return;
    }
});

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const userName = req.session.authorization.username;

    let bookReviews = books[isbn].reviews;

    Object.keys(bookReviews).forEach((key)=>{
        if (bookReviews[key] === userName){
            delete bookReviews[key];
            return res.send("Review has been deleted");
        }

    });

    return res.send("Review was not found");

});
    

    

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
