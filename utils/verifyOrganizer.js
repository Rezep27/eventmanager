const User = require('../models/user');
const jwt = require('jsonwebtoken');

const verifyOrganizer = async (req, res, next) => {
    // Check if user is organizer
    const allowedTypes = "Organizer";
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(403).render('error', { 
            statusCode: 403,
            errorMessage: 'Access Denied - Not authorized - No token provided' 
        });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;
        const user = await User.findById(id);

        if (user.type === allowedTypes) {
            next();
        } else {
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        return res.status(403).render('error', { 
            statusCode: 403,
            errorMessage: 'Access Denied - Not organizer' 
        });
    }
};

module.exports = {verifyOrganizer};