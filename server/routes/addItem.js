const express = require('express');
const shopItemModel = require('../models/shopItem')
const addItemHandler = express.Router();

addItemHandler.post('/', async (req, res) => {
    const data = req.body;
    try {
        if (!data.operation) {
            data.paths = Array.from(req.files.map(file => `/media/${file.filename}`))
            const itemData = new shopItemModel(data);
            await itemData.save();
            res.status(200).json({ message: 'Item added successfully' })
        }
        else if (data.operation == 'edit') {
            data.paths = Array.from(data.paths.split(','));
            if (data.files) {
                data.paths = Array.from(req.files.map(file => `/media/${file.filename}`))
                delete data.files;
            }
            await shopItemModel.updateOne({ _id: data._id }, data);
            res.status(200).json({ message: 'Item updated successfully' })
        }
        else if (data.operation == 'delete') {
            await shopItemModel.deleteOne({ _id: data.id });
            res.status(200).json({ message: 'Item deleted successfully' });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
    }
});
module.exports = addItemHandler
