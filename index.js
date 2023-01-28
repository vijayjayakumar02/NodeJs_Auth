const express = require('express');
const app = express();
const env = require('dotenv');
const mongoose = require('mongoose');
//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts')

env.config();

//DB connection
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => 
    console.log('connected to DB!')
);



//Middleware
app.use(express.json());

//Route middleware
app.use('/api/user',authRoute);
app.use('/api/posts', postRoute);

app.listen(3000,()=> console.log('server up and running'));