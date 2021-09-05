const express = require('express');
const shopItemModel = require('../models/shopItem');
const fetchItemsHandler = express.Router();

fetchItemsHandler.post('/', async (req, res) => {
    const { sort, count } = req.body;
    try {
        if (!sort || sort == 'date') {
            const items = await shopItemModel.find({}).sort({ _id: -1 }).skip(count).limit(3);
            res.status(200).json(items)
        }
        else if (sort == 'pricelh') {
            const items = await shopItemModel.find({}).sort({ discountedPrice: 1 }).skip(count).limit(3);
            res.status(200).json(items)
        }
        else if (sort == 'pricehl') {
            const items = await shopItemModel.find({}).sort({ discountedPrice: -1 }).skip(count).limit(3);
            res.status(200).json(items)
        }
        else if (sort == 'relevance') {
            const items = await shopItemModel.find({}).sort({ ratings: -1 }).skip(count).limit(3);
            res.status(200).json(items)
        }

    } catch (err) {
        res.status(500).send();
    }
})

module.exports = fetchItemsHandler;