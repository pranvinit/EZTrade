const express = require('express');
const shopItemModel = require('../models/shopItem');
const categoryHandler = express.Router();

categoryHandler.get('/', async (req, res) => {
    const category = req.category;
    try {
        const items = await shopItemModel.find({ category: category })
        res.status(200).json(items)
    } catch {
        res.status(500).send();
    }
})

module.exports = categoryHandler;