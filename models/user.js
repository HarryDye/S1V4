var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    //makes it required i.e. not allowed to leave blank
    required: true,
    //trims white space before and after
    trim: true
  },
  name: {
      type: String,
      required: true,
      trim: true,
    },
    favoriteBook: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  });

//authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback){
//finds email
  User.findOne({ email: email})
//does something with found email or unfound email
    .exec(function (error, user){
      if (error){
        return callback(error);
      } else if(!user){
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      //compares password with  the hash version
      bcrypt.compare(password, user.password, function(error, result){
        if (result === true){
          return callback(null, user);
        } else{
          return callback();
        } 
      })
    });
}

// hash password before saving to database
//save is the hook name and is a keyword with mongoose
UserSchema.pre('save', function(next){
  //this is the object created by the user input, the form
  var user = this;
  //user is the document that mongoose will incert into mongo
  //password is the property on the object
  //10 applies the encryption process 10 times
  bcrypt.hash(user.password, 10, function(err,hash){
    if (err){
      return next(err);
    }
    //assigns the hash and the password gets over written
    user.password = hash;
    next();
  })
});


  var User = mongoose.model('User', UserSchema);
  module.exports = User;
