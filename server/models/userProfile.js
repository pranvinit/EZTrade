const mongoose = require('mongoose');
const userProfileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    userContact: {
        type: Number,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userAddress: {
        type: String,
        required: true
    },
    cartItems: {
        type: Array
    }
})
const userProfileModel = mongoose.model('userProfile', userProfileSchema)
module.exports = userProfileModel;