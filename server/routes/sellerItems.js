const express = require('express');
const shopItemModel = require('../models/shopItem');
const sellerItemsHandler = express.Router();

sellerItemsHandler.post('/', async (req, res) => {
    try {
        const id = req.body.id;
        const items = await shopItemModel.find({ sellerId: id }).sort({ _id: -1 });
        res.status(200).json(items)
    } catch {
        res.status(500).send()
        console.log('eero')
    }
})

module.exports = sellerItemsHandler;