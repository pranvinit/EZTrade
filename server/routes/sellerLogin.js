const express = require('express');
const bcrypt = require('bcrypt');
const sellerProfileModel = require('../models/sellerProfile')
const sellerProfileHandler = express.Router();

//importing jwt
const jwt = require('jsonwebtoken');

sellerProfileHandler.post('/', async (req, res) => {
    const { username, password } = req.body;
    const match = await sellerProfileModel.findOne({ username: username });
    if (match) {
        try {
            if (await bcrypt.compare(password, match.password)) {
                const token = jwt.sign({ id: match.id }, 'allowAccess', {
                    expiresIn: (60 * 60 * 12)
                })
                res.status(200).json({ authentication: true, jwtToken: token, message: 'authorisation success,  Redirecting..' });
            } else {
                res.status(200).json({ authentication: false, message: 'authorisation failed' });
            }
        }
        catch {
            res.status(500).send();
        }
    }
    else {
        res.status(200).json({ authentication: false, message: "seller doesn't exist" });
    }
})

module.exports = sellerProfileHandler;