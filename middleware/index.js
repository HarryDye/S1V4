//middleware to stop login people seeing the sign up page, by redirecting them
function loggedOut(req, res, next){
  //checks if user is logged in
  if (req.session && req.session.userId){
    return res.redirect('/profile');
  }
  return next();
}


function requiresLogin(req, res, next){

  if (req.session && req.session.userId){
  return next();
} else {
  var err = new Error('You must be logged in to view this page.');
  err.status = 401;
  return next(err);
}
}




  //eports to index.js-routes
  module.exports.loggedOut = loggedOut;
  module.exports.requiresLogin = requiresLogin;
