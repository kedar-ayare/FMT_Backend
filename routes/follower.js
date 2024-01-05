const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User")
const FollowReq = require("../models/FollowReq")

const tokenVerify = require("../middlewares/auth");
const { config } = require('dotenv');
const decrypt = require("../utilities.js/decrpyt")
const encrypt = require("../utilities.js/encrypt");
const { default: mongoose, Mongoose } = require('mongoose');


router.post('/accept/:reqId', tokenVerify, async (req, res) => {

    const session = await mongoose.startSession()
    session.startTransaction();

    if (req.params.id !== "") {

        try {
            const request = await FollowReq.findOne({ _id: req.params.reqId })
            console.log(request)
            request.status = "Accepted"
            request.save()

            await Users.findOneAndUpdate(
                { _id: request.senderId },
                { $push: { following: request.receiverId } },
                { new: true }
            )

            await Users.findOneAndUpdate(
                { _id: request.receiverId },
                {
                    $push: { followers: request.senderId },
                    $pull: { followReqs: req.params.reqId }
                },
                { new: true }
            )

        } catch (err) {
            console.log(err)
            session.abortTransaction()
            res.send({ err: "FollowErr-03" })
        } finally {
            session.endSession()
            res.send({ err: "OK" })
        }

    } else {
        res.send({ err: "FollowErr-01" })
    }

})


//For when Un-Follows other User
router.post('/decline/:reqId', tokenVerify, async (req, res) => {
    if (req.params.reqId !== "") {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            const request = await FollowReq.findOneAndUpdate(
                { _id: req.params.reqId },
                { status: "Declined" },
                { new: true }
            )


            await Users.findOneAndUpdate(
                { _id: request.receiverId },
                {
                    $pull: { followReqs: request._id }
                }
            )
        } catch (err) {
            session.abortTransaction()
            res.send({ err: "FollowErr-04" })
        } finally {
            session.endSession()
            res.send({ err: "OK" })
        }

    } else {
        res.send({ err: "FollowErr-01" })
    }
})

router.post('/follow/:id', tokenVerify, async (req, res) => {
    if (req.params.id !== "") {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            await Users.findOneAndUpdate(
                { _id: req.User },
                { $push: { following: req.params.id } }
            )

            await Users.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { followers: req.User } }
            )

        } catch (err) {
            session.abortTransaction()
            res.send({ err: "FollowErr-05" })
        } finally {
            session.endSession()
            res.send({ err: "OK" })
        }

    } else {
        res.send({ err: "FollowErr-01" })
    }
})

router.post('/unfollow/:id', tokenVerify, async (req, res) => {
    if (req.params.id !== "") {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            await Users.findOneAndUpdate(
                { _id: req.User },
                { $pull: { following: req.params.id } },
                { new: true }
            )

            await Users.findOneAndUpdate(
                { _id: req.params.id },
                { $pull: { followers: req.User } },
                { new: true }
            )

        } catch (err) {
            session.abortTransaction()
            res.send({ err: "FollowErr-06" })
        } finally {
            session.endSession()
            res.send({ err: "OK" })
        }

    } else {
        res.send({ err: "FollowErr-01" })
    }
})





//Creating new Request and adding ReqId to the user's pending req's list
router.post('/request/:id', tokenVerify, async (req, res) => {
    if (req.params.id === "") {
        res.send({ err: "FollowErr-01" })
    } else {

        // Starting Transaction to avoid Inconsistancy
        const session = await mongoose.startSession();
        session.startTransaction();

        // Creating new Request Object
        const request = new FollowReq({
            senderId: req.User,
            receiverId: req.params.id,
            timestamp: new Date()
        })



        try {
            const newReq = await request.save();

            const user = await Users.findOne({ _id: req.params.id })
            user.followReqs.push(newReq._id)
            await user.save();

        } catch (err) {
            session.abortTransaction()
            console.log(err)
            res.send({ err: "ErrorVal-02" })
        } finally {
            session.endSession();
            res.send({ err: "OK" })
        }
    }
})

module.exports = router;