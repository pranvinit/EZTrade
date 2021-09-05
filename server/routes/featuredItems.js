const express = require('express');
const shopItemModel = require('../models/shopItem');
const featuredItemsHandler = express.Router();

featuredItemsHandler.get('/', async (req, res) => {
    try {
        const featuredItems = await shopItemModel.find({}).sort({ ratings: -1 }).limit(5);
        res.status(200).json(featuredItems);
    } catch (err) {
        res.status(500).send();
    }
})

module.exports = featuredItemsHandler;