const mongoose = require("mongoose");

const hash = require("../utils/hash");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      minlength: 3,
    },
    lname: {
      type: String,
      required: true,
      minlength: 3,
    },
    role: {
      type: Boolean,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 12,
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = hash.encrypt(user.password);
  }
  next();
});

module.exports = mongoose.model("users", userSchema);
