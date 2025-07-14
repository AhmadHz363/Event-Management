const express = require("express");
const router = express.Router();
const UserService = require("../Services/UserServices");
const UserStatus= require("../Models/enums/UserStatus");
const UserRoles= require("../Models/enums/UserRoles");

// Create new user (sign up)
router.post("/", async (req, res) => {
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
router.get('/', async (req, res) => {
  try {
    const user = await UserService.getAll();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get user by id
router.get('/:id', async (req, res) => {
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
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await UserService.update(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user by id
router.delete("/:id", async (req, res) => {
  try {
    await UserService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/test", async (req, res) => {
  try {
    // const user = await UserService.create(req.body);
    // res.status(201).json(user);
    res.status(200).json({ message: "test test" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
