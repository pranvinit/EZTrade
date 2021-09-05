const express = require('express');
const bcrypt = require('bcrypt');
const userProfileModel = require('../models/userProfile')
const userLoginHandler = express.Router();

//importing jwt
const jwt = require('jsonwebtoken');

userLoginHandler.post('/', async (req, res) => {
    const { username, password } = req.body;
    const match = await userProfileModel.findOne({ username: username })
    if (match) {
        try {
            if (bcrypt.compare(password, match.password)) {
                const token = jwt.sign({ id: match.id }, 'allowAccess', {
                    expiresIn: (60 * 60 * 24)
                })
                res.status(200).json({ authentication: true, jwtToken: token, message: 'Authentication success,  Redirecting..' })
            } else {
                res.status(200).json({ authentication: false, message: 'Wrong credentials, authentication failed' });
            }

        } catch (err) {
            res.status(500).send();
        }
    } else {
        res.status(404).send()
    }
})

module.exports = userLoginHandler;