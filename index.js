const express = require("express");

//create webserver
const app = express();

const bikeRouter = require("./routers/bikeRouter");

//creating routes
app.use("/bikes/", bikeRouter);



//webserver started on port 8000
app.listen(8000, () => {
    console.log("express started");
})