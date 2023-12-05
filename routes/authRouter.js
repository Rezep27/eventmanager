const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const {createToken} = require('../utils/utils');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => { 
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        // Create user
        const user = await User.create({ email, password });

        // Create JWT tokens
        const token = createToken(user._id);

        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        // Create and send token
        res.status(201).json({ token: token, user: user._id });

    }
    catch (ex) {
        console.log(ex);
        res.status(400).render('error', { 
          stausCode: 400,
          errorMessage: 'User not created' 
        });
    }
});


router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => { 
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).render('error', { 
              stausCode: 400,
              errorMessage: 'User not found'
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).render('error', { 
              stausCode: 400,
              errorMessage: 'Password is incorrect'
            });
        }

        // Create and send token
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ user: user._id });
    } catch (ex) {
        console.log(ex);
        res.status(400).render('error', { 
          stausCode: 400,
          errorMessage: 'Login error'
        });
    }
});


const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
  
    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decodedToken.id };
        next();
      } catch (err) {
        res.status(403).render('error', { 
          statusCode: 403,
          errorMessage: 'Access Denied - Not authorized' 
        });
      }
    } else {
      res.status(403).render('error', { 
        statusCode: 403,
        errorMessage: 'Access Denied - Not authorized' 
      });
    }
  };
  
  router.use('/profile', requireAuth);

  router.get('/profile', async (req, res, next) => {
    res.render('profile');
  });
  
  router.put('/profile/edit', async (req, res) => {
    try {
      const { email, password } = req.body;
      const userId = req.user._id;
      let updateData = {};
  
      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({ error: 'Email is already in use' });
        }
        updateData.email = email;
      }
  
      if (password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(password, salt);
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
      res.status(200).json({ user: updatedUser._id });
    } catch (ex) {
      console.log(ex);
      res.status(500).json({ error: 'Error, user not updated' });
    }
  });
  
  router.delete('/profile/delete', async (req, res) => {
    try {
      const userId = req.user._id;
      await User.findByIdAndDelete(userId);
      res.clearCookie('jwt');
      res.status(200).json({ message: 'User successfully deleted' });
    } catch (ex) {
      console.log(ex);
      res.status(500).json({ error: 'Error, user not deleted' });
    }
  });

module.exports = router;