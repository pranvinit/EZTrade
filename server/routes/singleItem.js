const express = require('express');
const shopItemModel = require('../models/shopItem');
const singleItemHandler = express.Router();

singleItemHandler.post('/', async (req, res) => {
    const id = req.body.id
    try {
        const singleItem = await shopItemModel.findOne({ _id: id })
        res.status(200).json(singleItem)
    } catch (err) {
        res.status(200).json({ message: 'Failed to fetch the item' })
    }
})

module.exports = singleItemHandler;