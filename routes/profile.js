const { Router } = require("express");
const auth = require('../middleware/auth');
const User = require ('../models/user');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const router = Router();

router.get('/', async (req, res) => {
  res.render('profile', {
    title: 'Профіль',
    isProfile: true,
    user: req.user.toObject()
  });
});

router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const toChange = {
      name: req.body.name,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
    }

    if (req.body.password) {
      const newPassword = await bcrypt.hash(req.body.password, 12);
      toChange.password = newPassword;
    }

    if (req.body.deleteAvatar) {
      const user = await User.findById(req.user._id);
      user.avatarUrl = '';
      await user.save();
    } else {
      if (req.file) {
        const user = await User.findById(req.user._id);
        user.avatarUrl = req.file.path;
        await user.save();
      }
    }

    Object.assign(user, toChange);
    await user.save();
    res.redirect('/profile');
    } 
    catch (err) {
      console.log(`Error: ${err}`);
    }
});

module.exports = router;