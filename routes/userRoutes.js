const express = require('express');
const router = express.Router();
const User = require('../models/User');

// create user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;