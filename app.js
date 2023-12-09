const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const authRouter = require('./routes/authRouter');
const eventRouter = require('./routes/eventRouter');
const Event = require('./models/event');
const { checkUser } = require('./utils/checkUser');

//middleware
app.use(express.static('public')); 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(checkUser);

//view engine
app.set('view engine', 'ejs');

//database connection
const connectionString = process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(connectionString)
.then( res => app.listen(process.env.PORT, () => console.log('Server running on port 3000')))
.catch(error => console.log(error));


// Default routes
app.get('/', async (req, res) => {
    // Get data from database
    try {
        const data = await Event.find({})

        res.render('home', {data});
    } catch (e) {
        res.status(500).send('Error fetching data');
        console.log(e);
    } 

});

app.use(authRouter)
app.use(eventRouter)

app.get('/error', function(req, res){
    res.status(404).render('error', {
        statusCode: 404,
        errorMessage: 'Page Not Found'
    });
});

// Error Page Not Found
app.get('*', function(req, res){
    res.status(404).render('error', {
        statusCode: 404,
        errorMessage: 'Page Not Found'
    });
});