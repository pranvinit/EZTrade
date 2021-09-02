const express = require('express');
const userProfileModel = require('../models/userProfile');
const cartHandler = express.Router();

cartHandler.post('/', async (req, res) => {
    const { user, item, operation } = req.body;
    try {
        if (!operation) {
            await userProfileModel.updateOne({ _id: user }, { $push: { cartItems: item } });
            res.status(200).send();
        }
        else if (operation == 'remove') {
            await userProfileModel.updateOne({ _id: user }, { $pull: { cartItems: { _id: item } } });
            res.status(200).send();
        }
        else if (operation == 'addToPending') {
            await userProfileModel.updateOne({ _id: user }, { $pull: { cartItems: { _id: item._id } } });
            await userProfileModel.updateOne({ _id: user }, { $push: { pendingOrders: item } });
            res.status(200).send();
        }
        else if (operation == 'removePending') {
            await userProfileModel.updateOne({ _id: user }, { $pull: { pendingOrders: { _id: item } } });
            res.status(200).send();
        }
        else if (operation == 'placeOrder') {
            await userProfileModel.updateOne({ _id: user }, { $push: { orders: item } });
            await userProfileModel.updateOne({ _id: user }, { $pull: { pendingOrders: { _id: item._id } } });
            res.status(200).send();
        }
    } catch {
        res.status(500).send()
    }

})

module.exports = cartHandler;