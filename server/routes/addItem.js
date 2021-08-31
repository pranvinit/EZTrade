const express = require('express');
const shopItemModel = require('../models/shopItem')
const addItemHandler = express.Router();

addItemHandler.post('/', async (req, res) => {
    try {
        const data = req.body;
        data.paths = Array.from(req.files.map(file => `/media/${file.filename}`))
        delete data.files;
        const itemData = new shopItemModel(data);
        await itemData.save();
        res.status(200).send()
    } catch (err) {
        res.status(500).send()
    }
});
module.exports = addItemHandler
