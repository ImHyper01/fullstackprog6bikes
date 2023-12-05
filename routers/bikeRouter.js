//node router
const express = require("express");
const router = express.Router();

const Bike = require("../models/bikeModel");


//create route with pagination
router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const totalBikes = await Bike.countDocuments();
        const totalPages = Math.ceil(totalBikes / limit);

        const skip = (page - 1) * limit;

        const bikes = await Bike.find()
            .skip(skip)
            .limit(limit);

        const bikeCollection = {
            bikes,
            pageInfo: {
                currentPage: page,
                totalPages,
                totalItems: totalBikes,
                itemsPerPage: limit
            },
            _links: {
                self: {
                    href: `${process.env.BASE_URI}bikes/?page=${page}&limit=${limit}`
                },
                collection: {
                    href: `${process.env.BASE_URI}bikes/`
                }
            }
        };

        res.json(bikeCollection);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//create router for detail
router.get("/:_id", async (req, res) => {
    //find(_id)
    console.log(`GET request for detail ${req.params._id}`);

    try {
        let bikes = await Bike.findById(req.params._id);

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

//middlewear checking headers put
router.put("/_id", (req, res, next) => {
    console.log("middleware to check content type")

    if (req.header("Content-Type") !== "application/json" && req.header("Content-Type") !== "application/x-www-form-urlencoded"){

        res.status(400).send();

    } else {
        next();
    }
})

//middleware checking empty values put
router.put("/_id", (req, res, next) => {
    console.log("middleware to check empty value")

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

router.options("/:id", async (req, res) => {
    console.log("OPTIONS (Details)");

    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS')
    res.send()
})


module.exports = router;