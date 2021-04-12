var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const cors = require("cors");
var dotenv = require("dotenv");

dotenv.config();


//mongoose
var mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

mongoose.connect(
    "mongodb+srv://admin:admin@CodeHustle@cluster0.d6nfm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    mongooseOptions
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("mongodb connection established");
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var teamsRouter = require('./routes/teams');
var authRouter = require("./routes/auth");
var bidRouter = require("./routes/bids")


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/teams', teamsRouter);
app.use("/auth", authRouter);
app.use("/bid", bidRouter);

module.exports = app;
