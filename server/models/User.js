const mongoose = require('mongoose');
//const validator = require('validator')
const bcrypt = require('bcryptjs')


var UserSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
    // added validation for email
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type: Number,
    default : 0,
  }
});



//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
      throw new Error('Unable to login')
  }

  // const isMatch = await bcrypt.compare( password, user.password)
  // if (!isMatch) {
  //     throw new Error('Unable to login')
  // }
  if (password != user.password) {
    return ('Unable to login')
  }
  return user
}

var User = mongoose.model('User', UserSchema);
module.exports = User;