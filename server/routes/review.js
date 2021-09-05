const express = require('express');
const shopItemModel = require('../models/shopItem');
const reviewHandler = express.Router();

reviewHandler.post('/', async (req, res) => {
    const { type, data } = req.body;
    // console.log(req.body)
    try {
        if (type == 'comment') {
            await shopItemModel.updateOne({ _id: data.id }, { $push: { comments: data } });
            res.status(200).send();
        }
        else if (type == 'rating') {
            await shopItemModel.updateOne({ _id: data.id }, { $push: { ratings: data } });
            res.status(200).send();
        }
    }
    catch (err) {
        res.status(500).send();
    }
})

module.exports = reviewHandler;