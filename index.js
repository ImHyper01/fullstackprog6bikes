const express = require("express");
const bodyParser = require('body-parser');

//load env file
require("dotenv").config();

//Test env file
console.log(process.env.BASE_URI);

//setup data connection
const mongoose = require("mongoose");

//create connection
mongoose.connect("mongodb://127.0.0.1:27017/bikes")

// const cors = require("cors");

//create webserver
const app = express();

//use cors
// app.use(cors());

//use bodyparser middleware to parse x-form-www-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
//use bodyparser middleware to parse json data
app.use(bodyParser.json({ type: 'application/json'}))


const bikeRouter = require("./routers/bikeRouter");

//creating routes
app.use("/bikes/", bikeRouter);

//webserver started on port 8000
app.listen(8000, () => {
    console.log("express started");
})