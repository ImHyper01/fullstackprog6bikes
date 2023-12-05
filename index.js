const express = require("express");


//load env file
require("dotenv").config();

//Test env file
console.log(process.env.BASE_URI);

//setup data connection
const mongoose = require("mongoose");

//create database and connect
const mongoDB = "mongodb://127.0.0.1:27017/bikes"
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));


//create webserver
const app = express();

const bikeRouter = require("./routers/bikeRouter");

//creating routes
app.use("/bikes/", bikeRouter);



//webserver started on port 8000
app.listen(8000, () => {
    console.log("express started");
})