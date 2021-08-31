const express = require('express');
const bcrypt = require('bcrypt');
const userProfileModel = require('../models/userProfile');
const addUserHandler = express.Router();

addUserHandler.post('/', async (req, res) => {
    const data = req.body;
    const validate = await userProfileModel.exists({ username: data.username })
    if (validate) {
        res.status(200).json({ message: 'User already exists', auth: false })
    } else {
        try {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(data.password, salt);
            const newUser = new userProfileModel(data);
            await newUser.save();
            res.status(200).json({ message: 'Seller added successfully, Redirecting..', auth: true })
        }
        catch {
            res.status(500).send()
        }
    }
})

module.exports = addUserHandler;