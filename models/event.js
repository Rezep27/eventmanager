const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Enter a name for the event'], unique: true},
    price: { type: Number, required: [true, 'Enter a price (0 for free pass)']},
    description: { type: String, required: [true, 'Enter a description for the event']},
    category: { type: String, required: [true, 'Enter a category for the event']},
    address: { type: String, required: [true, 'Enter an address for the event']},
    date: { type: Date, required: [true, 'Enter a description for the event']},
    startTime: { type: String, required: [true, 'Enter a description for the event']},
    endTime: { type: String, required: [true, 'Enter a description for the event']},
    uid: { type: String, required: [true, 'ID of the owner of the event']},
});


module.exports = mongoose.model('event', eventSchema);