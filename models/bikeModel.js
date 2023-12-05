const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bikeSchema = new Schema({
    model: String,
    brand: String,
    options: String,
})




module.exports = mongoose.model("Bike", bikeSchema);