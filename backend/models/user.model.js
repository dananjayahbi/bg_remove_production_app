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
  //gallery object array
  gallery: [
    {
      url: String,
    },
  ],  
});

const User = mongoose.model("User", userModel);

module.exports = User;
