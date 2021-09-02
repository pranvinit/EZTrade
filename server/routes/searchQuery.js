const express = require('express');
const shopItemModel = require('../models/shopItem');
searchQueryHandler = express.Router();

searchQueryHandler.post('/', async (req, res) => {
    const { query } = req.body;
    const regex = new RegExp(query, 'i')
    const results = await shopItemModel.find({ 'title': { $regex: regex } }).sort({ _id: -1 }).exec();
    res.status(200).json(results);
})

module.exports = searchQueryHandler;