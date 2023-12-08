const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');

//Schema for the new users created (user, organizer)
const userSchema = new mongoose.Schema({
    email: { type: String, required: [true, 'Please enter an email'], unique: true, lowercase: true, validator: [isEmail, 'Please enter a valid email']},
    type: { type: String, required: [true, 'User or Organizer?']},
    password: { type: String, required: [true, 'Please enter a password'], minlength: [6, 'Minimum password length is 6 characters']},
    firstname: { type: String, required: [true, 'Please enter a First name']},
    lastname: { type: String, required: [true, 'Please enter a Last name']}
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email});
    if(user) {
        const isAuth = await bcrypt.compare(password, user.password);
        if(isAuth) {
            return user;
            }
            throw Error('Incorrect password');
        }
    else {
        throw Error('Incorrect email');
    }
}

module.exports = mongoose.model('user', userSchema);