const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const { 
    register, 
    login,
    getNewToken,
    getAllUsers,
    getUserById,
    updateUser,
    changePassword,
    deleteUser
} = require("../controllers/userController");

// Register a user
router.post("/register", register);

// Login a user
router.post("/login", login);

// Get a new token
router.get("/token/:id", getNewToken);

// Get all users
// router.get("/getAllUsers", protect, getAllUsers);
router.get("/getAllUsers", getAllUsers);

// Get a user by id
// router.get("/getUserById/:id", protect, getUserById);
router.get("/getUserById/:id", getUserById);

// Update a user
// router.put("/updateUser/:id", protect, updateUser);
router.put("/updateUser/:id", updateUser);

// Change password
// router.put("/changePassword/:id", protect, changePassword);
router.put("/changePassword/:id", changePassword);

// Delete a user
// router.delete("/deleteUser/:id", protect, deleteUser);
router.delete("/deleteUser/:id", deleteUser);

module.exports = router;