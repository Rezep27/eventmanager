const { Router } = require('express');
const router = Router();
const Event = require('../models/event');
const User = require('../models/user');
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
        console.log(event.address);
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

router.get('/events/view/:id', async (req, res) => { 
    const id = req.params.id;
    const token = req.cookies.jwt;

    try {
        // Get all events data
        const data = await Event.find({})

        // Check event data based on id
        const eventData = await Event.findOne({ _id: id })

        // Find the organizer name based on the event uid
        const organizer = await User.findById(eventData.uid);

        // Check if user is authenticated to display event options
        if (!token) {
            const userData = "";
            res.render('eventView', { data, eventData, userData, organizer});
        } else {
            // Check user data
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const idToken = decodedToken.id;
            const userData = await User.findById(idToken);

            res.render('eventView', { data, eventData, userData, organizer});
        }
        

    } catch (e) {
        res.status(500).render('error', { 
            statusCode: 500,
            errorMessage: 'Error fetching data' 
        });
        console.log(e);
    } 
});

router.put('/events/view/:id', verifyOrganizer, async (req, res) => {
    const id = req.params.id;
    const updates = { name: req.body.name, price: req.body.price, description: req.body.description, category: req.body.category, address: req.body.address, date: req.body.date, startTime: req.body.startTime, endTime: req.body.endTime};
    const token = req.cookies.jwt;

    try {
        const data = await Event.findOne({ _id: id })
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ID = decodedToken.id;
        if (data.uid == ID) {
            const updatedEvent = await Event.findByIdAndUpdate(id, updates, {new: true});
            console.log("Updated Event: ", updatedEvent)
            res.status(200).send('/events/view/' + id);
        } else {
            res.status(401).render('error', { 
                statusCode: 500,
                errorMessage: 'Unauthorized' 
            });
        }
    } catch (e) {
        res.status(500).render('error', { 
            statusCode: 500,
            errorMessage: 'Error fetching data' 
        });
        console.log(e);
    }
});

router.delete('/events/view/:id', verifyOrganizer, async (req, res) => {
    const id = req.params.id;
    const token = req.cookies.jwt;
    
    try {
        const data = await Event.findOne({ _id: id })
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ID = decodedToken.id;
        if (data.uid == ID) {
            const deletedEvent = await Event.findByIdAndDelete(id, {delete: true});
            console.log("Event Deleted");   
            res.status(200).send('/');
        } else {
            res.status(401).render('error', { 
                statusCode: 500,
                errorMessage: 'Unauthorized' 
            });
        }
    } catch (e) {
        res.status(500).render('error', { 
            statusCode: 500,
            errorMessage: 'Error fetching data' 
        });
        console.log(e);
    } 
});

module.exports = router;