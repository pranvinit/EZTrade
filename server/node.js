const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 5000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pranavOne:pranavTwo@cluster0.f9ksh.mongodb.net/ezTrade?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error: '));
connection.once('open', () => console.log('We are connected to the database'));



app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}`));