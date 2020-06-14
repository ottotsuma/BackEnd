const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//import routes
const authRoute = require('./routes/auth');


dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => console.log('connected to database!')
);

//Middlewears
app.use(express.json());

//route middlewears
app.use('/api/user', authRoute);

app.listen(3000, () => console.log("server up and running"));
