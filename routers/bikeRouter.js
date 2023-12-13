//node router
const express = require("express");
const router = express.Router();

const Bike = require("../models/bikeModel");


//create route
router.get("/", async (req, res) => {
    console.log("GET");

    if(req.header('Accept') !== "application/json"){
        res.status(415).send();
    }

    try {
        let bikes = await Bike.find();
        // Representation for the collection
        let bikesCollection = {
            items: bikes,
            _links: {
                self: {
                    href: `${process.env.BASE_URI}bikes/`
                },
                collection: {
                    href: `${process.env.BASE_URI}bikes/`
                }
            },
            pagination: {
                temp: "Hier komt de pagination."
            }
        }
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.setHeader("Access-Control-Allow-Headers", 'example-request');
        res.setHeader("Access-Control-Allow-Method", 'GET, POST, OPTIONS');
        res.json(bikesCollection);
    } catch {
        res.status(500).send();
    }
})

//create router for detail
router.get("/:_id", async (req, res) => {

    try {
        let bike = await Bike.findById(req.params._id)
        if (bike == null) {
            res.status(404).send();
        } else {

            res.setHeader("Access-Control-Allow-Origin", '*');
            res.setHeader("Access-Control-Allow-Headers", 'example-request');
            res.setHeader("Access-Control-Allow-Method", 'GET, PUT, DELETE, OPTIONS');
            res.json(bike)
        }

    } catch {
        res.status(415).send();
    }
})

router.post("/",  (req, res, next ) => {
    console.log("POST middleware to check content-type")

    if (req.header("Content-Type") !== "application/json" && req.header("Content-Type") !== "application/x-www-form-urlencoded") {
        res.status(415).send();
    } else {
        next();
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

//POST route
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

//middelwear checking headers put
router.put("/_id", (req, res, next) => {
    console.log("put: middleware to check content type")

    if (req.header("Content-Type") !== "application/json" && req.header("Content-Type") !== "application/x-www-form-urlencoded"){

        res.status(400).send();

    } else {
        next();
    }
})

//middleware checking empty values put
router.put("/_id", (req, res, next) => {
    console.log("put: middleware to check empty value")

    if (req.body.model && req.body.brand && req.body.options) {
        next();
    } else {
        res.status(400).send();
    }

})

//PUT route
router.put("/_id", async (req, res) => {

    let bike = await Bike.findOneAndUpdate(req.params,
        {
            model: req.body.model,
            brand: req.body.brand,
            options: req.body.options
        })

    try {
        bike.save();

        res.status(200).send();
    } catch {
        res.status(500).send;
    }
})

//Delete items
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

router.options("/:_id", async (req, res) => {
    console.log("OPTIONS for Details");

    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS')
    res.send()
})


module.exports = router;