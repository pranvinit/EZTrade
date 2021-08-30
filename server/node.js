const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const moment = require('moment');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static('../public/media'));
const PORT = process.env.PORT || 5000;

const jwt = require('jsonwebtoken');

//importing routes
const addSellerHandler = require('./routes/addSeller');
const sellerLoginHandler = require('./routes/sellerLogin');
const authorisationHandler = require('./routes/authorisation');
const addItemHandler = require('./routes/addItem');
const fetchItemsHandler = require('./routes/fetchItems')
const singleItemHandler = require('./routes/singleItemHandler')

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pranavOne:pranavTwo@cluster0.f9ksh.mongodb.net/ezTrade?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error: '));
connection.once('open', () => console.log('We are connected to the database'));

const verify = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        res.status(200).json({ authorisation: false, message: 'authentication failed' });
    } else {
        jwt.verify(token, 'allowAccess', (err, decoded) => {
            if (err) {
                res.status(200).json({ authorisation: false, message: 'authentication failed' });
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }

}

//specifiying and handling dynamic paths
app.use('/item/:_id', singleItemHandler)

//importing multer and saving images
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/media')
    },
    filename: (req, file, cb) => {
        const fileName = (moment().format("MMM Do YY") + file.originalname).replace(/\s+/g, '-');
        cb(null, fileName)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('invalid format'))
        }
    },

}).array('files');
app.use('/addItem', (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            res.status(200).json({ message: 'Invalid format' })
        } else {
            next()
        }
    })
}, addItemHandler)

app.use('/authenticateSeller', verify, authorisationHandler)

app.use('/addSeller', addSellerHandler)
app.use('/sellerLogin', sellerLoginHandler)
app.use('/fetchItems', fetchItemsHandler)

app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}`));