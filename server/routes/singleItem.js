const express = require('express');
const shopItemModel = require('../models/shopItem');
const singleItemHandler = express.Router();

singleItemHandler.get('/', async (req, res) => {
    const id = req.itemId;
    try {
        const singleItem = await shopItemModel.findOne({ _id: id })
        res.status(200).json(singleItem)
    } catch (err) {
        console.log(err)
        console.log(req.id)
        res.status(200).json({ message: 'Failed to fetch the item' })
    }
})

module.exports = singleItemHandler;