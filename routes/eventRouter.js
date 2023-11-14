const { Router } = require('express');
const router = Router();
const Event = require('../models/event');

router.get('/events/create', (req, res) => { 
    res.render('eventCreate');
});

router.post('/events/create', async (req, res) => {
    try {
        const {name, price, description} = req.body;
        const event = await Event.create({name, price, description});
        res.status(201).json({event: event._id});
    }
    catch(ex) {
        console.log(ex);
        res.status(400).send('Error, event not created');
    }
});

module.exports = router;