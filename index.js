const express = require("express");

//create webserver
const app = express();


//creating routes
app.get("/", (req, res) => {
    res.send("hello world");
})


//webserver started on port 8000
app.listen(8000, () => {
    console.log("express started");
})