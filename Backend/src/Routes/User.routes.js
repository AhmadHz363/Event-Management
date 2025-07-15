const express = require("express");
const router = express.Router();
const UserService = require("../Services/UserServices");
const UserStatus= require("../Models/enums/UserStatus");
const UserRoles= require("../Models/enums/UserRoles");
const verifyToken = require('../Middlewares/authMiddleware');
const authorizeRoles = require('../Middlewares/roleMiddleware');
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  const response = await UserService.login({ username, password });
  if (!response.success) {
    return res.status(response.code).json({ error: response.error });
  }
  // Return token and user data
  res.status(200).json({
    message: "Login successful",
    token: response.token,
    user: response.user
  });
});
//apply middleware jwt auth

const protectedRouter = express.Router();
protectedRouter.use(verifyToken);

protectedRouter.post("/", async (req, res) => {
  const { username, email, password, role, status, profile } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required." });
  }
  if (!UserStatus.isValid(status)) {
    return res.status(400).json({ error: "Invalid status provided." });
  }
  if (!UserRoles.isValid(role)) {
    return res.status(400).json({ error: "Invalid role provided." });
  }

  try {
    const user = await UserService.create({
      username,
      email,
      password,
      role,
      profile,
      status,
    });
    res.status(201).json({
      objectId: user.id,
      username: user.get("username"),
      email: user.get("email"),
      role: user.get("role"),
      status: user.get("status"),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//get all users
protectedRouter.get('/',authorizeRoles(UserRoles.ADMIN),async (req, res) => {
  try {
    const user = await UserService.getAll();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get user by id
protectedRouter.get('/:id',authorizeRoles(UserRoles.ADMIN), async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserService.getById(id);
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'User not found or internal server error. '+err });
  }
});


// Update user by id
protectedRouter.put("/:id" ,authorizeRoles(UserRoles.ADMIN),async (req, res) => {
  try {
    const updatedUser = await UserService.update(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user by id
protectedRouter.delete("/:id",authorizeRoles(UserRoles.ADMIN), async (req, res) => {
  try {
    const deleteUser=  await UserService.delete(req.params.id);
    res.send(deleteUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
