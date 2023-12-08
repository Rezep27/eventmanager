const { Router } = require('express');
const router = Router();
const Event = require('../models/event');
const jwt = require('jsonwebtoken');
const { verifyOrganizer } = require('../utils/verifyOrganizer');
require('dotenv').config();


router.get('/events/create', verifyOrganizer, (req, res) => { 
    res.render('eventCreate');
});

router.post('/events/create', verifyOrganizer, async (req, res) => {
    try {
        const token = req.cookies.jwt;
        
        const {name, price, description, category, address, date, startTime, endTime} = req.body;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;
        const event = await Event.create({name, price, description, category, address, date, startTime, endTime, uid: id});
        console.log("Event created successfully. Event ID: " + event._id);
        res.status(201).send('/');
    }
    catch(ex) {
        console.log(ex);
        res.status(400).render('error', { 
            statusCode: 400,
            errorMessage: 'Event not created' 
        });
    }
});

router.get('/events/view', async (req, res) => { 
    // Get data from database
    try {
        const data = await Event.find({})

        res.render('eventView', {data});
    } catch (e) {
        res.status(500).render('error', { 
            statusCode: 500,
            errorMessage: 'Error fetching data' 
        });
        console.log(e);
    } 
});

router.get('/events/edit/:id', verifyOrganizer, async (req, res) => {
    const id = req.params.id;
    const token = req.cookies.jwt;

    try {
        const data = await Event.findOne({ _id: id })
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ID = decodedToken.id;
        if (data.uid == ID) {
            res.render('eventEdit', {data});
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (e) {
        res.status(500).render('error', { 
            statusCode: 500,
            errorMessage: 'Error fetching data' 
        });
        console.log(e);
    } 
});

router.put('/events/edit/:id', verifyOrganizer, async (req, res) => {
    const id = req.params.id;
    const updates = { name: req.body.name, price: req.body.price, description: req.body.description};
    const token = req.cookies.jwt;

    try {
        const data = await Event.findOne({ _id: id })
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ID = decodedToken.id;
        if (data.uid == ID) {
            const updatedEvent = await Event.findByIdAndUpdate(id, updates, {new: true});
            console.log("Updated Event: ", updatedEvent)
            res.status(200).send('/events/view');
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (e) {
        res.status(500).render('error', { 
            statusCode: 500,
            errorMessage: 'Error fetching data' 
        });
        console.log(e);
    }
});


router.get('/events/delete/:id', verifyOrganizer, async (req, res) => {
    const id = req.params.id;
    const token = req.cookies.jwt;
    try {
        const data = await Event.findOne({ _id: id })
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ID = decodedToken.id;
        
        if (data.uid == ID) {
            res.render('eventDelete', {data});
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (e) {
        res.status(500).render('error', { 
            statusCode: 500,
            errorMessage: 'Error fetching data' 
        });
        console.log(e);
    } 
});

router.delete('/events/delete/:id', verifyOrganizer, async (req, res) => {
    const id = req.params.id;
    const token = req.cookies.jwt;
    
    try {
        const data = await Event.findOne({ _id: id })
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ID = decodedToken.id;
        if (data.uid == ID) {
            const deletedEvent = await Event.findByIdAndDelete(id, {delete: true});
            console.log("Event Deleted");   
            res.status(200).send('/events/view');
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (e) {
        res.status(500).render('error', { 
            statusCode: 500,
            errorMessage: 'Error fetching data' 
        });
        console.log(e);
    } 
});

router.get('/event1', async (req, res) =>{
    res.render('event1');
})

router.get('/event2', async (req, res) =>{
    res.render('event2');
})

module.exports = router;