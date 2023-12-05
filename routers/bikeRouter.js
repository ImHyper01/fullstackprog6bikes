//node router
const express = require("express");
const router = express.Router();

let items = [
    {
        model: "Chopper",
        brand: "Harley davidson",
    },
    {
        model: "Ninja",
        brand: "Kawasaki",
    },
    {
        model: "Racer",
        brand: "Ducati",
    }

]


//create route
router.get("/", (req, res) => {
    console.log("GET")
    res.json(items);
})

//create router for detail
router.get("/:id", (req, res) => {
    console.log("GET")
    res.send(`detail for one bike = ${req.params.id}`);
})



router.post("/", (req, res) => {
    console.log("POST")
    res.send("hello world");
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