const user = require('./../model/User');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
mongoose.connect("mongodb+srv://Bears19:Bears11@cluster0-scly5.mongodb.net/test?retryWrites=true&w=majority");

const User = new user({
    name: 'Orange',
    email: 'Pizza@Pizza.com',
    password: '123456789'
}) 
mongoose.disconnect()