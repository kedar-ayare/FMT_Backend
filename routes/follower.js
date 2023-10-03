const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User")

const tokenVerify = require("../middlewares/auth");
const { config } = require('dotenv');
const decrypt = require("../utilities.js/decrpyt")
const encrypt = require("../utilities.js/encrypt")


router.post('/add/:id', tokenVerify, async (req, res) => {
    try {
        const user = await Users.findOne({ "_id": req.params.id });
        user.followers.push(req.User)
        user.save()

        try {
            const selfUser = await Users.findOne({ "_id": req.User });
            selfUser.following.push(req.params.id);
            selfUser.save()
            res.send({ msg: "Success" })
        } catch (err) {
            console.log(err)
            res.send({ err: "Error changing current user's status" })
        }
    } catch (err) {
        console.log("Something wrong")
        res.send({ err: "Error fetching user" })
    }

})

router.post('/remove/:id', tokenVerify, async (req, res) => {
    try {
        const user = await Users.findOne({ "_id": req.params.id });
        var arr = user.followers.filter((val) => val != req.User)
        user.followers = arr
        user.save()

        try {
            const selfUser = await Users.findOne({ "_id": req.User });
            var arr = selfUser.following.filter((val) => val != req.params.id)
            selfUser.following = arr
            selfUser.save()
            res.send({ msg: "Success" })
        } catch (err) {
            console.log(err)
            res.send({ err: "Error changing current user's status" })
        }




    } catch (err) {
        console.log("Something wrong")
        res.send({ err: "Error fetching user" })
    }
})

module.exports = router;