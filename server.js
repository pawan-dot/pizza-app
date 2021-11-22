require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
var bodyParser = require('body-parser')

const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
//const { MongoDBStore } = require('connect-mongodb-session');
const passport = require("passport");
const Emitter = require('events')

// Database connection
//const url = 'mongodb://localhost/pizza';
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Connection failed........");
  });

//Assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Event emitter
const eventEmitter = new Emitter()//create emitter 
app.set('eventEmitter', eventEmitter)//bind emiter from app and use anywhere this

//Session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET, //secret for cookie key
    resave: false,
    store: MongoDbStore.create({
      mongoUrl: process.env.MONGO_CONNECTION_URL, //mongo connection url
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hour
  })
);
//passport alwayes bellow to the session
//passport config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());


//globle middleware for session cart item no.update
app.use((req, res, next) => {
  res.locals.session = req.session;//use user from session in local
  res.locals.user = req.user;//use user from session in local

  next();
});


//use flash as a middleware
app.use(flash());

//assets
app.use(express.static("public"));

// set Template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

//calling routes from function
require("./routes/web")(app);

const server = app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});



// Socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {//make server side connection
  // Join to client
  // console.log(socket.id)//check socket id
  socket.on('join', (orderId) => {//join event to emit client at orderId room
    //console.log(orderId)// print oderId which recieve from clint to server
    socket.join(orderId)
  })

  //event emmiter from order update from orderstatus

  eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
  })

  // eventEmitter.on('orderPlaced', (data) => {
  //   io.to('adminRoom').emit('orderPlaced', data)
})
