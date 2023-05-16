const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User")

const tokenVerify = require("../middlewares/auth");


router.post('/', tokenVerify, async (req, res) => {
    // console.log(req.body.name);
    // var users = await Users.find({ fname: { $regex: req.body.name, $options: 'i' } });
    var searchQuery = req.body.name.split(" ");
    var users = await Users.find({
        $or: [
            { fname: { $regex: new RegExp(searchQuery.join('|')), $options: 'i' } },
            { lname: { $regex: new RegExp(searchQuery.join('|')), $options: 'i' } },
        ]
    });
    console.log(users);
    res.send("Route to get search results")
})

router.post('/add', tokenVerify, async (req, res) => {
    console.log(req.User);
    try {
        await Users.updateOne(
            { _id: req.User },
            { $addToSet: { searched: req.body.profId } },
        );
        console.log("Added successfully")
    } catch (err) {
        console.log(err)
    }

    res.send("Add a profile to current User's Searched List");
})

router.post('/delete', tokenVerify, async (req, res) => {
    console.log(req.User);
    try {
        await Users.updateOne(
            { _id: req.User },
            { $pull: { searched: req.body.profId } },
        );
        console.log("Removed successfully")
    } catch (err) {
        console.log(err)
    }
    res.send("Remove a profile to current User's Searched List");
})

module.exports = router