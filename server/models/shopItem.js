const mongoose = require('mongoose');
const shopItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
    sellerName: {
        type: String,
        required: true
    },
    sellerEmail: {
        type: String,
        required: true
    },
    sellerContact: {
        type: Number,
        required: true
    },
    shopAddress: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    paths: {
        type: Array,
        required: true
    }
})

const shopItemModel = mongoose.model('shopItem', shopItemSchema);
module.exports = shopItemModel;