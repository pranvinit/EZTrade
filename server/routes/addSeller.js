const express = require('express');
const bcrypt = require('bcrypt');
const addSellerHandler = express.Router();
const sellerProfileModel = require('../models/sellerProfile');

addSellerHandler.post('/', async (req, res) => {
    const data = req.body;
    const validate = await sellerProfileModel.exists({ username: data.username })
    if (validate) {
        res.status(200).json({ message: 'Seller already exists', operation: 'warning' })
    } else {
        try {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(data.password, salt);
            const newSeller = new sellerProfileModel(data);
            await newSeller.save();
            res.status(200).json({ message: 'Seller added successfully, Redirecting..', operation: 'success' })
        }
        catch {
            res.status(500).send()
        }
    }
})

module.exports = addSellerHandler;