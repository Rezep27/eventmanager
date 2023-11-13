const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const authRouter = require('./routes/authRouter');

//middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

//view engine
app.set('view engine', 'ejs');

//database connection
const connectionString = process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(connectionString)
.then( res => app.listen(process.env.PORT, () => console.log('Server running on port 3000')))
.catch(error => console.log(error));

//routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/employees', (req, res) => {
    res.render('employees');
});

app.use(authRouter)