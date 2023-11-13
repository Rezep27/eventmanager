const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const {createToken} = require('../utils/utils');

router.get('/signup', (req, res) => { 
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.create({email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000})
        res.stat
        us(201).json({user: user._id});
    }
    catch(ex) {
        console.log(ex);
        res.status(400).send('Error, user not created');
    }
});

module.exports = router;