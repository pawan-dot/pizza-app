require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo');
//const { MongoDBStore } = require('connect-mongodb-session');
// const passport = require('passport')
// const Emitter = require('events')

// Database connection
//const url = 'mongodb://localhost/pizza';
mongoose.connect(process.env.MONGO_CONNECTION_URL,
     { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err=> {
    console.log('Connection failed........')
})


//Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,//secret for cookie key
    resave: false,
    store: MongoDbStore.create({
    mongoUrl:process.env.MONGO_CONNECTION_URL //mongo connection url
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))

//use flash as a middleware
app.use(flash())

//assets
app.use(express.static('public'));
// set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//calling routes from function  
require('./routes/web')(app);

app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`)
})

