const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register
const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  if (email.indexOf("@") === -1) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: passwordHash });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  if (email.indexOf("@") === -1) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate and send the JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get a token
const getNewToken = async (req, res) => {
  try {
    const userId = req.params.id; // Access the "id" from the URL parameter
    if (userId) {
      const userFetch = await User.findById({ _id: userId });
      if (userFetch) {
        // generate token
        const token = jwt.sign({ id: userFetch._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        res.json(token);
      } else {
        res.status(404).json({
          errorMessage: "User not found",
        });
      }
    } else {
      res.status(400).json({
        errorMessage: "Id not found in URL parameter",
      });
    }
  } catch (e) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Get a user
const getUserById = async (req, res) => {
  try {
    const userFetch = await User.findById(req.params.id);
    if (userFetch) {
      res.json(userFetch);
    } else {
      res.status(404).json({
        errorMessage: "User not found",
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Get all users
const getAllUsers = async (req, res) => {
  try {
    const userFetch = await User.find();
    if (userFetch) {
      res.json(userFetch);
    } else {
      res.status(404).json({
        errorMessage: "Users not found",
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Update a user
const updateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFetch = await User.findById(req.params.id);

    let updateData = {
      email: email ? email : userFetch.email,
      password: password ? password : userFetch.password,
    };

    const update = await User.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      res.status(200).json({
        data: "User updated successfully!",
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: "Failed updating the User!\n" + error,
        status: false,
      });
    }
  } catch (e) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

//Password change
const changePassword = async (req, res) => {
  try {
    const userFetch = await User.findById(req.params.id);
    if (userFetch) {
      const isPasswordMatch = await bcrypt.compare(
        req.body.oldPassword,
        userFetch.password
      );

      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Old password mismatch!" });
      }

      //hash the password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(req.body.newPassword, salt);

      userFetch.password = passwordHash;

      const updatedUser = await userFetch.save();
      if (updatedUser) {
        res.json(updatedUser);
      }
    } else {
      res.status(404).json({
        errorMessage: "User not found",
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Delete a user with "findByIdAndDelete"
const deleteUser = async (req, res) => {
  try {
    const userFetch = await User.findByIdAndDelete(req.params.id);
    if (userFetch) {
      res.json({
        message: "User deleted successfully",
      });
    } else {
      res.status(404).json({
        errorMessage: "User not found",
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

module.exports = {
  register,
  login,
  getNewToken,
  getUserById,
  getAllUsers,
  updateUser,
  changePassword,
  deleteUser,
};