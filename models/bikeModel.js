const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bikeSchema = new Schema({
    model: String,
    brand: String,
    options: String,
}, { toJSON: {virtuals: true}})

bikeSchema.virtual('_links').get(
    function () {
        return {
            self: {
                href: `${process.env.BASE_URI}bikes/${this._id}`
            },
            collection: {
                href: `${process.env.BASE_URI}bikes/`
            }
        }
    }
)


module.exports = mongoose.model("Bike", bikeSchema);