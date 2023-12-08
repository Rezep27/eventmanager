const jwt = require('jsonwebtoken');
const User = require('../models/user');

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    try{
        if (token === undefined) {
            res.locals.user = false;
            res.locals.org = false;
            next();
        } else {
            res.locals.user = true;
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const id = decodedToken.id;
            const data = await User.findOne({ _id: id })
            if (data.type == 'Organizer') {
                res.locals.org = true;
                next()
            } else {
                res.locals.org = false;
                next()
            }
        }
    }catch(err){
        res.locals.user = false;
        res.locals.org = false;
        console.log(err);
    }
    
};

module.exports = {checkUser};