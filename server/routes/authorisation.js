const express = require('express');
const authorisationHandler = express.Router();
const sellerProfileModel = require('../models/sellerProfile');

authorisationHandler.get('/', async (req, res,) => {
    try {
        const data = await sellerProfileModel.findOne({ _id: req.userId });
        const dataObj = data.toObject()
        delete dataObj.username;
        delete dataObj.password;
        delete dataObj.__v;
        res.status(200).json({ authorisation: true, data: dataObj });
    }
    catch {
        res.status(500).send();
    }
})

module.exports = authorisationHandler;