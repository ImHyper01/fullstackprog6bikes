//node router
const express = require("express");
const router = express.Router();

const Bike = require("../models/bikeModel");

function currentItems(total, start, limit) {
    let items = 0;

    items = Math.ceil(limit);

    if (!limit) {
        items = total
    }

    if (!start) {
        items = total
    }

    return items
}

function currentPage(total, start, limit) {

    let currentPage = Math.ceil(start / limit)


    if (!limit) {
        currentPage = 1
    }

    if (!start) {
        currentPage = 1
    }

    return currentPage

}

function lastPageItem(total, limit) {

    return Math.ceil((total - limit) + 1);

    // limit = 5
    // pages = 4

    // total = 18
    // result = 14
}

function numberOfPages(total, start, limit) {

    let totalPages = Math.ceil(total / limit);

    if (!limit || limit === 0) {
        totalPages = 1;
    }

    if (!start || start === 0) {
        totalPages = 1;
    }

    return totalPages
}


function nextPageItem(total, start, limit) {

    let nextPage = Math.ceil(start / limit) + 1

    if (!limit) {
        nextPage = 1
    }

    if (!start) {
        nextPage = 1
    }

    return nextPage
}

function previousPageItem(total, start, limit) {

    let previousPage = Math.ceil(start / limit) + 1

    if (!limit) {
        previousPage = 1
    }

    if (!start) {
        previousPage = 1
    }

    return previousPage
}

function giveURI(uriType, total, start, limit) {
    let uri = ""

    switch (uriType) {
        case "first":
            uri = `?start=1&limit=${limit}`
            break
        case "last":
            uri = `?start=${lastPageItem(total, limit)}&limit=${limit}`
            break
        case "next":
            uri = `?start=${start + limit}&limit=${limit}`
            break
        case "previous":
            uri = `?start=${start - limit}&limit=${limit}`
            break
    }

    if (!limit) {
        uri = ""
    }
    if (!start) {
        uri = ""
    }

    return uri
}

function lastPage(total, start, limit) {
    let lastPage = Math.ceil(total / limit)

    if (!start) {
        lastPage = 1
    }

    if (!limit) {
        lastPage = 1
    }

    return lastPage
}



//create route
router.get("/", async (req, res) => {
    console.log("GET");

    const page = parseInt(req.query.page);
    const start = parseInt(req.query.start)

    // const start = parseInt(req.query.start);

    let limit = parseInt(req.query.limit);
    const totalItems = await Bike;

    const startIndex = (page - 1) * limit;

    if(req.header('Accept') !== "application/json"){
        res.status(415).send();
    }

    try {
        let bikes = await Bike.find().limit(limit).skip(startIndex).exec();

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
                currentPage: currentPage(totalItems, start, limit),
                currentItems: currentItems(totalItems, start, limit),
                totalPages: numberOfPages(totalItems, start, limit),
                totalItems: totalItems,

                _links: {
                    first: {
                        page: 1,
                        href: `${process.env.BASE_URI}bikes/${giveURI("first", totalItems, start, limit)}`
                    },
                    last: {
                        page: lastPage(totalItems, start, limit),
                        href: `${process.env.BASE_URI}bikes/${giveURI("last", totalItems, start, limit)}`
                    },

                    next: {
                        page: nextPageItem(totalItems, start, limit),
                        href: `${process.env.BASE_URI}bikes/${giveURI("next", totalItems, start, limit)}`
                    },
                    previous: {
                        page: previousPageItem(totalItems, start, limit),
                        href: `${process.env.BASE_URI}bikes/${giveURI("previous", totalItems, start, limit)}`
                    }
                }
            }
        }

        res.setHeader("Access-Control-Allow-Origin", '*');
        res.setHeader("Access-Control-Allow-Headers", 'example-request');
        res.setHeader("Access-Control-Allow-Methods", 'GET, POST, OPTIONS');
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
            res.setHeader("Access-Control-Allow-Methods", 'GET, PUT, DELETE, OPTIONS');
            res.json(bike)
        }

    } catch {
        res.status(415).send();
    }
})



// Middleware om te controleren op lege waarden VOORDAT de resource wordt aangemaakt
router.post("/", (req, res, next) => {
    console.log("POST middleware to check content-type and empty values");

    if (
        req.header("Content-Type") !== "application/json" &&
        req.header("Content-Type") !== "application/x-www-form-urlencoded"
    ) {
        res.status(415).send();
    } else if (!req.body.model || !req.body.brand || !req.body.options) {
        res.status(400).send();
    } else {
        next();
    }
});

// POST-route voor het aanmaken van de resource
router.post("/", async (req, res) => {
    console.log("POST");

    let bike = new Bike({
        model: req.body.model,
        brand: req.body.brand,
        options: req.body.options,
    });

    try {
        await bike.save();
        res.status(201).json(bike);
    } catch {
        res.status(500).send();
    }
});


//middelwear checking headers put
router.put("/:_id", (req, res, next) => {
    console.log("put: middleware to check content type")

    if (req.header("Content-Type") !== "application/json" && req.header("Content-Type") !== "application/x-www-form-urlencoded"){
        res.status(400).send();

    } else {
        next();
    }
})

//middleware checking empty values put
router.put("/:_id", (req, res, next) => {
    console.log("put: middleware to check empty value")

    if (req.body.model && req.body.brand && req.body.options) {
        next();
    } else {
        res.status(400).send();
    }

})

//PUT route
router.put("/:_id", async (req, res) => {

    let bike = await Bike.findOneAndUpdate(req.params,
        {
            model: req.body.model,
            brand: req.body.brand,
            options: req.body.options
        })

    try {
        bike.save();

        res.status(201).send();
    } catch {
        res.status(500).send();
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


// Voor de OPTIONS van de collectie resource
router.options("/", (req, res) => {
    console.log("OPTIONS")
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.status(200).send();
});

// Voor de OPTIONS van de detail resource
router.options("/:_id", async (req, res) => {
    console.log("DETAIL OPTIONS")
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.status(200).send();
});


module.exports = router;