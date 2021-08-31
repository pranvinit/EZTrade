const express = require('express');
const userProfileModel = require('../models/userProfile');
const cartHandler = express.Router();

cartHandler.post('/', async (req, res) => {
    const { user, item, operation } = req.body;
    if (!operation) {
        try {
            await userProfileModel.updateOne({ _id: user }, { $push: { cartItems: item } });
            res.status(200).send()
        } catch {
            res.status(500).send()
        }
    }
    else if (operation == 'remove') {
        try {
            await userProfileModel.updateOne({ _id: user }, { $pull: { cartItems: { _id: item } } });
            res.status(200).send();
        } catch {
            res.status(500).send()
        }
    }
})

module.exports = cartHandler;