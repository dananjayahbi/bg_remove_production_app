const mongoose = require("mongoose");

const userSchema = mongoose.Schema;

const userModel = new userSchema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
});

const User = mongoose.model("User", userModel);

module.exports = User;
