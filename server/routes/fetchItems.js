const express = require('express');
const shopItemModel = require('../models/shopItem');
const fetchItemsHandler = express.Router();

fetchItemsHandler.post('/', async (req, res) => {
    const data = req.body;
    const items = await shopItemModel.find({}).sort({ _id: -1 }).skip(data.count).limit(3);
    res.status(200).json(items)
})

module.exports = fetchItemsHandler;