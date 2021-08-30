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
        res.status(200).json({ message: 'done bro' })
    } catch (err) {
        console.log(err)
        res.status(200).json({ message: 'failed bro' })
    }
});
module.exports = addItemHandler
