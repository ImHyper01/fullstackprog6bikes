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
router.get("/:id", async (req, res) => {
    //find(_id)
    console.log(`GET request for detail ${req.params.id}`);

    try {
        let bikes = await Bike.findById(req.params.id);

        res.json(bikes);
    } catch {
        res.status(404).send();
    }

})

router.post("/",  (req, res, next ) => {
    console.log("POST middleware to check content-type")

    if (req.header("Content-Type") === "application/json") {
        next();
    } else {
        res.status(415).send();
    }
});

//add middleware to disallow empty values
router.post("/",  (req, res, next ) => {
    console.log("POST middleware to check empty values")

    if (req.body.model && req.body.brand && req.body.options) {
        next();
    } else {
        res.status(400).send();
    }

});

router.post("/", async (req, res) => {
    console.log("POST")

    let bike = new Bike({
        model: req.body.model,
        brand: req.body.brand,
        options: req.body.options,
    })
    try {
        await bike.save();
        res.status(201).send;
    } catch {
        res.status(500).send;
    }

})


router.delete("/:_id", async (req, res) => {
    console.log("DELETE")

    try {
        await Bike.findByIdAndDelete(req.params._id);
        res.status(204).send();
    } catch {
        res.status(404).send
    }
})


router.options("/", (req, res) => {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    res.send();
})


module.exports = router;