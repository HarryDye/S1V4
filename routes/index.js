var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid = require('../middleware')

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  // //checks to see if the session has an id, if it doesnt exist then they arent logged in
  // if (! req.session.userId ) {
  //   var err = new Error("You are not authorized to view this page.");
  //   err.status = 403;
  //   return next(err);
  // } this above code is the same as the new middleware
  //retrieves the user ID from session store, then retrieves the user's information from Mongo
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
        }
      });
});

//GET /logout
router.get('/logout', function(req, res, next){
  if (req.session){
    // delete session object
    req.session.destroy(function(err){
      if(err){
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

//GET /login
router.get('/login', mid.loggedOut, function(req, res, next){
  return res.render('login', {title:'Log In'});
});

//POST /login
router.post('/login', function(req, res, next){
  if (req.body.email && req.body.password){
    User.authenticate(req.body.email, req.body.password, function (error, user){
      if (error || !user){
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        //user._id  is what we get back from the authenticate function when it's authenticated.
        //And user is our document, it represents all the information for  a single logged in user,
        //and finally the underscore ID is that unique ID that mongod gave the document when it was
        // inserted into the database
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error ('Email and password are required');
    err.status = 401;
    return next(err);
  }
});

//GET /register
router.get('/register', mid.loggedOut, function(req, res, next){
  return res.render('register', {title:'Sign Up'});
});

//POST /Register
//logic for the form, conditions, error messages, redirect to the profile page
router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword) {

      //confirms that the user typed the password twice
      if (req.body.password !== req.body.confirmPassword){
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      var userData = {
        email: req.body.email,
        name: req.body.name,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password
      };

      //use schemas create method to insert document into mongo
      User.create(userData, function(err, user){
        if (err) {
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });

    } else{
      var err = new Error('All fields are required.');
      err.status = 400;
      return next(err);
    }
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
