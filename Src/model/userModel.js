const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false // Default to false, meaning the account is inactive by default
    }
});

const Userdata = mongoose.model('Userdata', userSchema);

module.exports = Userdata;

