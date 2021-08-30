const mongoose = require('mongoose');
const sellerProfileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    sellerShopName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    sellerName: {
        type: String,
        required: true
    },
    sellerContact: {
        type: Number,
        required: true
    },
    sellerEmail: {
        type: String,
        required: true
    },
    sellerAddress: {
        type: String,
        required: true
    }
})
const sellerProfileModel = mongoose.model('sellerProfile', sellerProfileSchema)
module.exports = sellerProfileModel;