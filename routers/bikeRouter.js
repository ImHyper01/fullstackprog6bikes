//node router
const express = require("express");
const router = express.Router();

const Bike = require("../models/bikeModel");


//create route
router.get("/", async (req, res) => {
    console.log("GET")
    try {
        let bikes = await Bike.find();

        let bikeCollection = {
            model: bikes,
            _links: {
                self: {
                    href: `${process.env.BASE_URI}bikes/`
                },
                collection: {
                    href: `${process.env.BASE_URI}bikes/`
                }
            },
            pagination: "dit is een test kijken of het werkt"
        }

        res.json(bikeCollection);
    } catch {
        //no response to db
        res.status(500).send;
    }
})

//create router for detail
router.get("/:id", (req, res) => {
    //find(_id)
    console.log("GET")
    res.send(`detail for one bike = ${req.params.id}`);
})


router.post("/", async (req, res) => {
    console.log("POST")

    let bike = new Bike({
        model: "Racer",
        brand: "Ducati",
        options: "Super",
    })
    try {
        await bike.save();

        res.json(bike);
    } catch {
        res.status(500).send;
    }

})


router.delete("/", (req, res) => {
    console.log("DELETE")
    res.send("hello world");
})


router.options("/", (req, res) => {
    console.log("OPTIONS")
    res.send("hello world");
})


module.exports = router;